/**
 * Generate a random 16 bytes hex string
 */
export default () => {
  const h = `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`

  // change colour saturation, make it darker
  const rgb = [
    `0x${h[1] + h[2]}` | 0,
    `0x${h[3] + h[4]}` | 0,
    `0x${h[5] + h[6]}` | 0
  ]

  const h2 = `#${rgb.map((o) => {
    const x = (60 + o * 0.5) | 0
    const s = ('00' + x.toString(16)).slice(-2)
    return s
  }).join('')}`

  return h2
}
