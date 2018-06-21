import formatHex from './formatHex'

export default function randomHex (len) {
  const unpadded = Math.floor(Math.random() * 100000000000).toString(16)
  const padded = formatHex(unpadded, len)
  return padded
}
