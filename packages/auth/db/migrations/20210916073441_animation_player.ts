import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const playerSprite = await knex
    .table('sprite')
    .where({ name: 'player' })
    .first()
  if (!playerSprite) {
    throw new Error('player sprite not found')
  }
  return knex.table('animation').insert([
    {
      key: 'player_idle',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
    },
    {
      key: 'player_greet',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
    },
    {
      key: 'player_walk',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([7, 8, 9]),
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  const playerSprite = await knex
    .table('sprite')
    .where({ name: 'player' })
    .first()
  if (!playerSprite) {
    throw new Error('player sprite not found')
  }
  return knex.table('animation').where({ sprite_id: playerSprite.id }).del()
}
