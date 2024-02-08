import { ecdhDataT } from "../typings/crypt";
import { doubleReturn } from "../typings/global";
import { convertBufferToHex, convertHexToBuffer } from "./conversion";

async function encryptStringToHexAndIVHex(
  ecdhData: ecdhDataT,
  stringValue: string
): Promise<doubleReturn<string>> {
  try {
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const encrypt = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      ecdhData.sharedSecretKey,
      new TextEncoder().encode(stringValue)
    );

    return {
      status: true,
      value: convertBufferToHex(encrypt) + "." + convertBufferToHex(iv),
    };
  } catch (error) {
    return {
      status: false,
      message: "Crypto error occurred.",
      actions: ["resetKeyExchange"],
    };
  }
}

async function decryptHexAndIVHex(
  ecdhData: ecdhDataT,
  encryptedHexAndIVHex: string
): Promise<doubleReturn<string>> {
  try {
    const [encryptedMessage, initialVector] = encryptedHexAndIVHex.split(".");

    const decrypt = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: convertHexToBuffer(initialVector) },
      ecdhData.sharedSecretKey,
      convertHexToBuffer(encryptedMessage)
    );

    return { status: true, value: new TextDecoder().decode(decrypt) };
  } catch (error) {
    return {
      status: false,
      message: "Crypto error occurred.",
      actions: ["resetKeyExchange"],
    };
  }
}

export { encryptStringToHexAndIVHex, decryptHexAndIVHex };
