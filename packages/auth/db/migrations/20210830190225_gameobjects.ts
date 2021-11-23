import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  CREATE TABLE IF NOT EXISTS public.gameobject
  (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      type gameobjects_type NOT NULL,
      room_id uuid NOT NULL,
      tile json NOT NULL,
      settings json DEFAULT '{"occupiedTiles": []}'::json,
      updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      animation character varying COLLATE pg_catalog."default",
      player_id uuid,
      CONSTRAINT gameobject_pkey PRIMARY KEY (id),
      CONSTRAINT gameobject2room FOREIGN KEY (room_id)
          REFERENCES public.room (id) MATCH SIMPLE
          ON UPDATE NO ACTION
          ON DELETE NO ACTION
  )
  WITH (
      OIDS = FALSE
  )
  TABLESPACE pg_default;
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  DROP TABLE public.gameobject;
  `)
}
