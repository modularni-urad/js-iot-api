import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'

function _getFilter (filter) {
  try {
    return JSON.parse(filter)
  } catch (_) {
    throw new Error('wrong filter')
  }
}

export function find (cond, knex) {
  const filter = _getFilter(cond.filter)
  if (!_.isObject(filter) || _.isEmpty(filter)) {
    throw new Error('insufficient conditions')
  }
  let q = knex('envirodata')
  q = cond.fields ? q.select(cond.fields.split(',')) : q
  q = cond.limit ? q.limit(cond.limit) : q
  // mozna tohle? https://github.com/Terminal-Systems/knex-flex-filter
  return q.where(whereFilter(filter))
}

export function create (body, time, knex) {
  const data = _.map(body.payload_fields, (v, k) => {
    return {
      typ: k,
      value: v,
      dev_id: body.dev_id,
      app_id: body.app_id,
      time
    }
  })
  return knex('envirodata').insert(data)
}
