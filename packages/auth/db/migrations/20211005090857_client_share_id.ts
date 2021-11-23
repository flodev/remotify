import { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.raw(`
  alter table player add column client_share_id character varying(100);
  `)
}

exports.down = function (knex: Knex) {
  return knex.raw('alter table player drop column client_share_id;')
}
