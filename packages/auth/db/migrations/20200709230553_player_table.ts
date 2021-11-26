exports.up = function (knex, Promise) {
  return knex.schema.raw(`
CREATE TABLE public.player
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    firstname character varying(200) COLLATE pg_catalog."default",
    lastname character varying(200) COLLATE pg_catalog."default",
    username character varying(200) COLLATE pg_catalog."default" NOT NULL,
    active boolean DEFAULT true,
    email character varying(100) COLLATE pg_catalog."default",
    room_id uuid,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password character varying(100) COLLATE pg_catalog."default",
    tile json,
    animation character varying COLLATE pg_catalog."default",
    is_online boolean NOT NULL DEFAULT false,
    CONSTRAINT player_pkey PRIMARY KEY (id),
    CONSTRAINT player_room_id_fkey FOREIGN KEY (room_id)
        REFERENCES public.room (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.player
    OWNER to postgres;
  `);
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('player');
};
