exports.up = (knex, Promise) => {
  return knex.schema.createTable('envirodata', (table) => {
    table.integer('sensorid').notNullable()
    table.integer('typ').notNullable()
    table.float('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['sensorid', 'typ', 'created'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('envirodata')
}
