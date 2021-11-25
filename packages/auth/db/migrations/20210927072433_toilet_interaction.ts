import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const toiletSprite = await knex
    .table('sprite')
    .where({ name: 'toilet' })
    .first()
  const playerSprite = await knex
    .table('sprite')
    .where({ name: 'player' })
    .first()
  if (!toiletSprite) {
    throw new Error('toilet sprite not found')
  }
  if (!playerSprite) {
    throw new Error('player sprite not found')
  }

  return knex.table('animation').insert([
    {
      key: 'toilet_idle',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
      }),
      frames: JSON.stringify([0]),
      type: 'toilet_animation',
    },
    {
      key: 'toilet_dump',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
      }),
      frames: JSON.stringify([6]),
      type: 'toilet_animation',
    },
    {
      key: 'toilet_pee',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
      }),
      frames: JSON.stringify([4]),
      type: 'toilet_animation',
    },
    {
      key: 'toilet_take_a_dump',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
      }),
      frames: JSON.stringify([2]),
      type: 'toilet_interaction',
    },
    {
      key: 'toilet_take_a_pee',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
      }),
      frames: JSON.stringify([2]),
      type: 'toilet_interaction',
    },
    {
      key: 'toilet_flush',
      sprite_id: toiletSprite.id,
      settings: JSON.stringify({
        duration: 5000,
      }),
      frames: JSON.stringify([8, 9, 8]),
      type: 'toilet_interaction',
    },
    // ---------------- player ------------------
    {
      key: 'player_take_a_dump',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'toilet_interaction',
    },
    {
      key: 'player_take_a_pee',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'toilet_interaction',
    },
    {
      key: 'player_flush',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'toilet_interaction',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  const toiletSprite = await knex
    .table('sprite')
    .where({ name: 'toilet' })
    .first()
  if (!toiletSprite) {
    throw new Error('toilet sprite not found')
  }
  const playerSprite = await knex
    .table('sprite')
    .where({ name: 'player' })
    .first()
  if (!playerSprite) {
    throw new Error('player sprite not found')
  }
  await knex
    .table('animation')
    .where({ sprite_id: toiletSprite.id })
    .whereIn('key', [
      'toilet_idle',
      'toilet_pee',
      'toilet_dump',
      'toilet_take_a_dump',
      'toilet_take_a_pee',
      'toilet_flush',
    ])
    .del()
  return knex
    .table('animation')
    .where({ sprite_id: playerSprite.id })
    .whereIn('key', ['player_take_a_dump', 'player_take_a_pee', 'player_flush'])
    .del()
}
