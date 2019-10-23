exports.up = (knex, Promise) => {
  return knex.schema.createTable('sensor', (table) => {
    table.increments('id').primary()
    table.string('appid').notNullable()
    table.string('note').notNullable()
    table.float('lat').notNullable()
    table.float('lng').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('sensor')
}
