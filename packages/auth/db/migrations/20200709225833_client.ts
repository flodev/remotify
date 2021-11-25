
exports.up = function(knex, Promise) {
  return knex.schema.raw(`

CREATE TABLE public.client
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT client_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.client
    OWNER to postgres;
    `)
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists('client')
};
