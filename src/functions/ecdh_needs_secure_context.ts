import { doubleReturn } from "../typings/global";
import { convertBufferToHex, convertHexToBuffer } from "./conversion";
import { requestServerKeyHexAndClientID } from "./requests";

async function startKeyExchangeECDH(): Promise<
  doubleReturn<{
    clientID: string;
    sharedSecretKey: CryptoKey;
  }>
> {
  try {
    const clientKeyPair = await crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );

    const serverKeyHexAndClientIDRequestRes =
      await requestServerKeyHexAndClientID(
        convertBufferToHex(
          await crypto.subtle.exportKey("raw", clientKeyPair.publicKey)
        )
      );

    if (!serverKeyHexAndClientIDRequestRes.status)
      return serverKeyHexAndClientIDRequestRes;

    const serverPublicKey = await crypto.subtle.importKey(
      "raw",
      convertHexToBuffer(
        serverKeyHexAndClientIDRequestRes.value.serverPublicKeyHex
      ),
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    const sharedSecretKey = await crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: serverPublicKey,
      },
      clientKeyPair.privateKey,
      { name: "AES-CBC", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return {
      status: true,
      value: {
        clientID: serverKeyHexAndClientIDRequestRes.value.clientID,
        sharedSecretKey,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Crypto error occurred.",
      actions: ["resetKeyExchange"],
    };
  }
}

export { startKeyExchangeECDH };
