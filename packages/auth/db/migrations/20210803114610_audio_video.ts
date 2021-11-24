import { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.raw(`
  alter table player add column is_audio_video_enabled boolean NOT NULL DEFAULT false;
  `)
}

exports.down = function (knex: Knex) {
  return knex.raw('alter table player drop column is_audio_video_enabled;')
}
