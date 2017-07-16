/**
 * Time filter
 */

export const name = 'time'
export const alias = ''

 /**
 * Converts time to HH:MM:SS
 *
 * @param {string} string
 * @returns {string}
 */

export function apply(string) {
  if (!string) return

  let h = Math.floor(string / 3600)
  let m = Math.floor(string % 3600 / 60)
  let s = Math.floor(string % 3600 % 60)
  return ((h > 0 ? h.toString() + ":" + (m < 10 ? "0" : "") : "") + m.toString() + ":" + (s < 10 ? "0" : "") + s.toString())
}
