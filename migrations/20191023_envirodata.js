exports.up = (knex, Promise) => {
  return knex.schema.createTable('envirodata', (table) => {
    table.string('app_id').notNullable()
    table.string('dev_id').notNullable()
    table.string('typ', 4).notNullable()
    table.integer('counter').notNullable()
    table.float('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['app_id', 'dev_id', 'typ', 'counter'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('envirodata')
}
