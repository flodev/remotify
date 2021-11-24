import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.table('sprite').insert([
    {
      name: 'player',
      settings: '{ "frameWidth": 100, "frameHeight": 100 }',
      url: 'assets/avatars/player.png',
    },
    {
      name: 'desk',
      settings: '{ "frameWidth": 120, "frameHeight": 60 }',
      url: 'assets/gameobjects/desk.png',
    },
    {
      name: 'toilet',
      settings: '{ "frameWidth": 30, "frameHeight": 50 }',
      url: 'assets/gameobjects/toilet.png',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .table('sprite')
    .whereIn('name', ['player', 'desk', 'toilet'])
    .del()
}
