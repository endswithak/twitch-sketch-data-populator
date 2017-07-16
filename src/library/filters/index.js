/**
 * Filters library
 *
 * Provides functionality extract, parse and apply filters.
 */

/**
 * Load filter functions
 */

import * as JoinFilter from './join'
import * as MaxFilter from './max'
import * as UppercaseFilter from './uppercase'
import * as LowercaseFilter from './lowercase'

/**
 * Load twitch filter functions
 */
import * as NumberFilter from '../../twitch/library/filters/number'
import * as DateFilter from '../../twitch/library/filters/date'
import * as TimeFilter from '../../twitch/library/filters/time'

let filters = [
  JoinFilter,
  MaxFilter,
  UppercaseFilter,
  LowercaseFilter,
  NumberFilter,
  TimeFilter,
  DateFilter
]

/**
 * Extracts filters from the placeholder string, e.g. firstName, lastName | & •
 *
 * @param {string} string
 * @returns {Array}
 */
export function extractFilters(string) {

  //prepare filters array
  let extractedFilters = []

  //get filters string, e.g. & • | upper
  //remove bracketed nested placeholders first, then split on first pipe
  let filtersString = string.replace(/\((.*)\)/g, '').split(/\|(.+)?/g)[1]
  if (filtersString && filtersString.length) {

    //get individual filters
    let filterStrings = filtersString.split(/\|/g)

    //parse filters
    extractedFilters = filterStrings.map((filterString) => {
      return parseFilter(filterString)
    })
  }

  return extractedFilters
}


/**
 * Parses the filter string, e.g. & •
 *
 * @param {string} filterString
 * @returns {Object}
 *
 * returned filter: {
 *   command: {string},
 *   param: {string}
 * }
 */
export function parseFilter(filterString) {

  //remove whitespace from beginning of string
  let fstring = filterString.replace(/^\s+/, '');

  //get command
  let command = null
  for (let i = 0; i < filters.length; i++) {
    if (fstring.startsWith(filters[i].name)) {
      command = filters[i].name
      break;
    }
    else if (fstring.startsWith(filters[i].alias) && filters[i].alias.length) {
      command = filters[i].alias
      break;
    }
  }

  //get param by removing the command from the string
  let param = fstring.substring(command.length)

  //create filter
  let filter = {
    command: command.trim()
  }

  //add param to filter
  if (param.length && param.trim().length) filter.param = param

  return filter
}


/**
 * Removes the filters part of a placeholder content string.
 *
 * @param {string} string
 * @returns {string}
 */
export function removeFiltersString(string) {

  //get filters string, e.g. & • | upper
  //remove bracketed nested placeholders first, then split on first pipe
  let filtersString = string.replace(/\((.*)\)/g, '').split(/\|(.+)?/g)[1]

  //remove filters string from string
  return string.replace('|' + filtersString, '')
}


/**
 * Applies the supplied filter to the input to produce an output.
 *
 * @param {Object} filter
 * @param {Array/string} input
 */
export function applyFilter(filter, input) {

  //find apply function for the specified filter
  let applyFunction
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].name == filter.command || filters[i].alias == filter.command) {
      applyFunction = filters[i].apply
    }
  }

  //return input back as the apply function doesn't exist
  if (!applyFunction) return input

  //apply filter to input, passing in the param
  return applyFunction(input, filter.param)
}
