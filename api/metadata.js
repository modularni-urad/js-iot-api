import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'
import { TNAMES } from '../consts'

function _getFilter (filter) {
  try {
    return JSON.parse(filter)
  } catch (_) {
    throw new Error('wrong filter')
  }
}

export function findMetadata (cond, knex) {
  const filter = _getFilter(cond.filter)
  if (!_.isObject(filter) || _.isEmpty(filter)) {
    throw new Error('insufficient conditions')
  }
  let q = knex(TNAMES.METADATA)
  q = cond.fields ? q.select(cond.fields.split(',')) : q
  q = cond.limit ? q.limit(cond.limit) : q
  // mozna tohle? https://github.com/Terminal-Systems/knex-flex-filter
  return q.where(whereFilter(filter))
}
