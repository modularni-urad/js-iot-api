
exports.up = (knex, Promise) => {
  return knex.schema.createTable('devices', (table) => {
    table.increments('id').primary()
    table.string('app_id').notNullable()
    table.string('dev_id').notNullable()
    table.float('latitude').notNullable()
    table.float('longitude').notNullable()
    table.float('altitude').notNullable()
    table.string('description')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('devices')
}
