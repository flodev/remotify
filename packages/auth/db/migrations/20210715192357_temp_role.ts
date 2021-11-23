import { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.insert({ name: 'temp_user' }).into('role')
}

exports.down = function (knex: Knex) {
  return knex('role').where({ name: 'temp_user' }).del()
}
