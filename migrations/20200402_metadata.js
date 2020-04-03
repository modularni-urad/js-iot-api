exports.up = (knex, Promise) => {
  return knex.schema.createTable('metadata', (table) => {
    table.string('app_id').notNullable()
    table.string('dev_id').notNullable()
    table.json('metadata').notNullable()
    table.timestamp('time').notNullable()
    table.primary(['app_id', 'dev_id', 'time'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('metadata')
}
