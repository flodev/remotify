import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  alter table player add column sprite_id uuid;
  `)
  const { id: spriteId } = await knex
    .select('id')
    .from('sprite')
    .where({ name: 'player' })
    .first()

  if (!spriteId) {
    throw new Error('player sprite not found')
  }
  await knex.table('player').update({ sprite_id: spriteId })
  return knex.raw(`
  alter table player alter column sprite_id SET not null;
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  alter table player drop column sprite_id;
  `)
}
