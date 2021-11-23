import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
  alter table gameobject add column type_id uuid not null;
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  alter table gameobject drop column type_id;
  `)
}
