import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  CREATE TYPE public.gameobjects_type AS ENUM
    ('desk', 'toilet');`)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  DROP TYPE public.gameobjects_type;
  `)
}
