export function padBytes (str, count) {
  if (str.substring(0, 2) === '0x') {
    str = str.slice(2)
  }
  const pad = str.padStart(count * 2, '0')
  return '0x'.concat(pad)
}

export default function randomHex (len) {
  const limit = Math.min(Math.pow(len, 16), Number.MAX_SAFE_INTEGER)
  const unpadded = Math.floor(Math.random() * limit).toString(16)
  const padded = padBytes(unpadded, len)
  return padded
}
