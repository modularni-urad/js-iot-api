
export function info (id, knex) {
  return knex('sensor').where({ id: id }).first()
}

export function find (cond, knex) {
  return knex('sensor').where(cond)
}

export function create (body, knex) {
  return knex('sensor').returning('id').insert(body)
}

export function update (id, data, knex) {
  return knex('sensor').where({ id: id }).update(data)
}

export function InitSensorsApp (app, knex, authMW, JSONBodyParser) {
  //
  app.get('/:id([0-9]+)', (req, res, next) => {
    info(req.params.ticketId, knex)
      .then(info => {
        res.json(info)
        next()
      })
      .catch(next)
  })

  app.get('/', authMW, (req, res, next) => {
    find(req.query, knex)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })

  app.post(`/`, authMW, JSONBodyParser, (req, res, next) => {
    const uid = req.user ? req.user.id : null
    create(req.body, uid, knex)
      .then(savedid => {
        res.status(201).json(savedid)
        next()
      })
      .catch(next)
  })

  app.put(`/:id([0-9]+)`, authMW, JSONBodyParser, (req, res, next) => {
    update(req.params.ticketId, req.body, knex)
      .then(rowsupdated => {
        res.json(rowsupdated)
        next()
      })
      .catch(next)
  })
}
