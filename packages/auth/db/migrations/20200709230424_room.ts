
exports.up = function(knex, Promise) {
  return knex.schema.raw(`

  CREATE TABLE public.room
  (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
      name character varying(100) COLLATE pg_catalog."default" NOT NULL,
      updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      client_id uuid NOT NULL,
      CONSTRAINT rooms_pkey PRIMARY KEY (id),
      CONSTRAINT client_foreign FOREIGN KEY (client_id)
          REFERENCES public.client (id) MATCH SIMPLE
          ON UPDATE NO ACTION
          ON DELETE NO ACTION
          NOT VALID
  )
  WITH (
      OIDS = FALSE
  )
  TABLESPACE pg_default;

  ALTER TABLE public.room
      OWNER to postgres;
    `)
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTableIfExists('room')
};
