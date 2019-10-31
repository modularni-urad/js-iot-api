// import _ from 'underscore'

export function find (cond, knex) {
  return knex('envirodata').where(cond)
}

export function InitDataApp (app, knex) {
  //
  app.get('/', (req, res, next) => {
    find(req.query, knex)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })
}
