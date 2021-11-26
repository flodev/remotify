import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`

  CREATE TABLE IF NOT EXISTS public.refresh_token
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    is_revoked boolean NOT NULL,
    expired_at timestamp without time zone NOT NULL,
    CONSTRAINT refresh_token_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('refresh_token');
}
