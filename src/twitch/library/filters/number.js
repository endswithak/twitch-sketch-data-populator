/**
 * Number filter
 */

export const name = 'number'
export const alias = ''

/**
 * Localizes numbers
 *
 * @param {number} number
 * @returns {string}
 */

export function apply(number) {
  return number.toLocaleString();
}
