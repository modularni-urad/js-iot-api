import _ from 'underscore'

export function find (cond, knex) {
  return knex('envirodata').where(cond)
}

// NOT used now
export function create (body, time, knex) {
  const typPromises = _.map(body.payload_fields, (v, k) => {
    const data = {
      typ: k,
      value: v,
      dev_id: body.dev_id,
      app_id: body.app_id,
      time
    }
    return knex('envirodata').insert(data).catch(err => console.error(err))
  })
  return Promise.all(typPromises)
}
