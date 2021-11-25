import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  CREATE TABLE IF NOT EXISTS public.sprite
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying COLLATE pg_catalog."default" NOT NULL UNIQUE,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    settings json DEFAULT '{}'::json,
    url character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sprite_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  drop table sprite;
  `)
}
