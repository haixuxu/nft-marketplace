export function utf8ToBase64(str: string) {
  const encodedStr = unescape(encodeURIComponent(str));
  const bytes = new Uint8Array(encodedStr.length);
  for (let i = 0; i < encodedStr.length; i++) {
    bytes[i] = encodedStr.charCodeAt(i);
  }
  const base64 = btoa(String.fromCharCode.apply(null, bytes as any));
  return base64;
}

export function base64ToUtf8(base64: string) {
  const binaryStr = atob(base64);
  let utf8Str = '';
  for (let i = 0; i < binaryStr.length; i++) {
    utf8Str += String.fromCharCode(binaryStr.charCodeAt(i));
  }
  const decodedStr = decodeURIComponent(escape(utf8Str));
  return decodedStr;
}
