import { doubleReturn } from "../typings/global";
import { convertBufferToHex, convertHexToBuffer } from "./conversion";
import { requestServerKeyHexAndClientID } from "./requests";

async function startKeyExchangeECDH(): Promise<
  doubleReturn<{
    clientID: string;
    sharedPrivateKeyHex: string;
  }>
> {
  try {
    const client = globalThis.createECDH("prime256v1");

    const clientPublicKeyHex = client.generateKeys("hex");

    const serverKeyHexAndClientIDRequestRes =
      await requestServerKeyHexAndClientID(clientPublicKeyHex);

    if (!serverKeyHexAndClientIDRequestRes.status)
      return serverKeyHexAndClientIDRequestRes;

    const sharedPrivateKeyHex = convertBufferToHex(
      client.computeSecret(
        convertHexToBuffer(
          serverKeyHexAndClientIDRequestRes.value.serverPublicKeyHex
        )
      )
    );

    return {
      status: true,
      value: {
        clientID: serverKeyHexAndClientIDRequestRes.value.clientID,
        sharedPrivateKeyHex,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Crypto error occurred.",
      actions: ["resetKeyExchange"],
    };
  }
}

export { startKeyExchangeECDH };
