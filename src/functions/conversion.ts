function convertBufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function convertHexToBuffer(str: string) {
  const arr = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substring(i, i + 2), 16));
  }

  return new Uint8Array(arr);
}

export { convertBufferToHex, convertHexToBuffer };
