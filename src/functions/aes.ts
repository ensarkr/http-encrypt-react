import { ecdhDataT } from "../typings/crypt";
import { doubleReturn } from "../typings/global";
import { convertBufferToHex, convertHexToBuffer } from "./conversion";

function encryptStringToHexAndIVHex(
  ecdhData: ecdhDataT,
  messageString: string
): doubleReturn<string> {
  const initialVector = crypto.getRandomValues(new Uint8Array(16));

  const cipher = globalThis.createCipheriv(
    "aes-256-cbc",
    convertHexToBuffer(ecdhData.sharedPrivateKeyHex),
    initialVector
  );

  let encryptedMessage = cipher.update(messageString, "utf-8", "hex");
  encryptedMessage += cipher.final("hex");

  return {
    status: true,
    value: encryptedMessage + "." + convertBufferToHex(initialVector),
  };
}

function decryptHexAndIVHex(
  ecdhData: ecdhDataT,
  encryptedHexAndIV: string
): doubleReturn<string> {
  const [encryptedHex, initialVectorHex] = encryptedHexAndIV.split(".");

  const decipher = globalThis.createDecipheriv(
    "aes-256-cbc",
    convertHexToBuffer(ecdhData.sharedPrivateKeyHex),
    convertHexToBuffer(initialVectorHex)
  );

  let decryptedMessage = decipher.update(encryptedHex, "hex", "utf-8");
  decryptedMessage += decipher.final("utf-8");

  return {
    status: true,
    value: decryptedMessage,
  };
}

export { encryptStringToHexAndIVHex, decryptHexAndIVHex };
