import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  CREATE TABLE IF NOT EXISTS public.gameobject_type
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name gameobjects_type NOT NULL,
    sprite_id uuid NOT NULL,
    settings json DEFAULT '{}'::json,
    CONSTRAINT gameobject_type_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  drop table gameobject_type;
  `)
}
