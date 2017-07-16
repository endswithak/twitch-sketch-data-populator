/**
 * Date filter
 */

export const name = 'date'
export const alias = ''

/**
 * Converts to localized date string
 *
 * @param {string} string
 * @returns {string}
 */

export function apply(string) {
  if (!string) return

  let options = { year: 'numeric', month: 'short', day: 'numeric' };

  let date = new Date(string)

  return date.toLocaleDateString('en-US', options);
}
