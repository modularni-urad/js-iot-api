exports.up = (knex, Promise) => {
  return knex.schema.createTable('metadata', (table) => {
    table.integer('devid').references('id').inTable('devices').notNullable()
    table.json('metadata').notNullable()
    table.timestamp('time').notNullable()
    table.primary(['devid', 'time'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('metadata')
}
