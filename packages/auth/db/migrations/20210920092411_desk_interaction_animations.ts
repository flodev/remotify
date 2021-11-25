import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const deskSprite = await knex.table('sprite').where({ name: 'desk' }).first()
  const playerSprite = await knex
    .table('sprite')
    .where({ name: 'player' })
    .first()
  if (!deskSprite) {
    throw new Error('desk sprite not found')
  }
  if (!playerSprite) {
    throw new Error('player sprite not found')
  }

  return knex.table('animation').insert([
    {
      key: 'desk_idle',
      sprite_id: deskSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'desk_animation',
    },
    {
      key: 'desk_work_hard',
      sprite_id: deskSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([5, 6, 7, 8, 9]),
      type: 'desk_interaction',
    },
    {
      key: 'desk_sleep',
      sprite_id: deskSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'desk_interaction',
    },
    {
      key: 'desk_punch_the_display',
      sprite_id: deskSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([10, 11, 12, 13]),
      type: 'desk_interaction',
    },
    {
      key: 'desk_hear_music',
      sprite_id: deskSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([0]),
      type: 'desk_interaction',
    },
    // ---------------- player ------------------
    {
      key: 'player_work_hard',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([14, 15, 16, 17]),
      type: 'desk_interaction',
    },
    {
      key: 'player_sleep',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 3,
        repeat: -1,
      }),
      frames: JSON.stringify([21, 22, 23, 24, 25, 26]),
      type: 'desk_interaction',
    },
    {
      key: 'player_punch_the_display',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([28, 29, 30, 31, 32]),
      type: 'desk_interaction',
    },
    {
      key: 'player_hear_music',
      sprite_id: playerSprite.id,
      settings: JSON.stringify({
        frameRate: 8,
        repeat: -1,
      }),
      frames: JSON.stringify([35, 36, 37, 38, 37, 36, 35]),
      type: 'desk_interaction',
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  const deskSprite = await knex.table('sprite').where({ name: 'desk' }).first()
  if (!deskSprite) {
    throw new Error('desk sprite not found')
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
    .where({ sprite_id: deskSprite.id })
    .whereIn('key', [
      'desk_idle',
      'desk_work_hard',
      'desk_sleep',
      'desk_punch_the_display',
      'desk_hear_music',
      'desk_idle',
    ])
    .del()
  return knex
    .table('animation')
    .where({ sprite_id: playerSprite.id })
    .whereIn('key', [
      'player_work_hard',
      'player_sleep',
      'player_punch_the_display',
      'player_hear_music',
    ])
    .del()
}
