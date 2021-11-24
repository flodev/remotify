import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `
    CREATE TABLE IF NOT EXISTS public.animation
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    key character varying(200) COLLATE pg_catalog."default",
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sprite_id uuid NOT NULL,
    frames json NOT NULL,
    settings json NOT NULL DEFAULT '{}'::json,
    type character varying COLLATE pg_catalog."default",
    CONSTRAINT animation_pkey PRIMARY KEY (id),
    CONSTRAINT animation2sprite FOREIGN KEY (sprite_id)
        REFERENCES public.sprite (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
);
    `
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(
    `
    drop table animation;
    `
  )
}
