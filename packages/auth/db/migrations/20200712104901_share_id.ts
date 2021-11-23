import { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.alterTable('client', function (t) {
    // drops previous default value from column, change type to string and add not nullable constraint
    t.string('share_id', 200)
  })
}

exports.down = function (knex) {}
