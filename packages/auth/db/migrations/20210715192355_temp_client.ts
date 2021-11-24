import { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.insert({ name: 'temporary' }).into('client')
}

exports.down = function (knex: Knex) {
  return knex('client').where({ name: 'temporary' }).del()
}
