exports.up = (knex, Promise) => {
  return knex.schema.createTable('envirodata', (table) => {
    table.integer('devid').references('id').inTable('devices').notNullable()
    table.string('typ', 4).notNullable()
    table.float('value').notNullable()
    table.timestamp('time').notNullable().defaultTo(knex.fn.now())
    table.primary(['devid', 'typ', 'time'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('envirodata')
}
