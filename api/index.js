import { find } from './data'

export function InitDataApp (app, JSONBodyParser, knex) {
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
