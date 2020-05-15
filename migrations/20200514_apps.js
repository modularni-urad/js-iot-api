import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.APPS, (table) => {
    table.string('app_id').notNullable().primary()
    table.string('endpoint').notNullable()
    table.string('app_secret').notNullable()
    table.string('error')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('apps')
}
