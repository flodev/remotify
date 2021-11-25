import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const { id: deskSpriteId } = await knex
    .select('id')
    .from('sprite')
    .where({ name: 'desk' })
    .first()

  if (!deskSpriteId) {
    throw new Error('desk sprite not found')
  }
  const { id: toiletSpriteId } = await knex
    .select('id')
    .from('sprite')
    .where({ name: 'toilet' })
    .first()

  if (!toiletSpriteId) {
    throw new Error('toilet sprite not found')
  }
  return knex.table('gameobject_type').insert([
    {
      name: 'desk',
      sprite_id: deskSpriteId,
      settings: {
        occupiedTilesCount: { vertical: 1, horizontal: 3 },
        interactionPosition: { x: 0, y: -1 },
      },
    },
    {
      name: 'toilet',
      sprite_id: toiletSpriteId,
      settings: {
        occupiedTilesCount: { vertical: 1, horizontal: 1 },
        interactionPosition: { x: 0, y: 1 },
      },
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  return knex.table('gameobject_type').whereIn('name', ['desk', 'toilet']).del()
}
