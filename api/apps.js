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

function find (cond, knex) {
  const filter = _getFilter(cond.filter)
  if (!_.isObject(filter) || _.isEmpty(filter)) {
    throw new Error('insufficient conditions')
  }
  let q = knex(TNAMES.APPS)
  q = cond.fields ? q.select(cond.fields.split(',')) : q
  q = cond.limit ? q.limit(cond.limit) : q
  return q.where(whereFilter(filter))
}

function create (data, knex) {
  return knex(TNAMES.APPS).insert(data)
}

function update (appId, data, knex) {
  return knex(TNAMES.APPS).update(data)
}

function destroy () {

}

export default { find, create, update, destroy }
