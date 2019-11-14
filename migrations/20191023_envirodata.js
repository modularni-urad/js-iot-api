exports.up = (knex, Promise) => {
  return knex.schema.createTable('envirodata', (table) => {
    table.string('app_id').notNullable()
    table.string('dev_id').notNullable()
    table.string('typ', 4).notNullable()
    table.float('value').notNullable()
    table.timestamp('time').notNullable().defaultTo(knex.fn.now())
    table.primary(['app_id', 'dev_id', 'typ', 'time'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('envirodata')
}
