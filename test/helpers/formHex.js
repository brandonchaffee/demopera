function rand (len) {
  const limit = Math.min(Math.pow(len, 16), Number.MAX_SAFE_INTEGER)
  const unpadded = Math.floor(Math.random() * limit).toString(16)
  const padded = pad(unpadded, len)
  return padded
}

function pad (str, count) {
  if (str.substring(0, 2) === '0x') {
    str = str.slice(2)
  }
  const padVal = str.padStart(count * 2, '0')
  return '0x'.concat(padVal)
}

export default {rand, pad}
