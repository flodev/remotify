import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
 alter table gameobject drop column type;
  `)
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
  alter table gameobject add column type gameobjects_type NOT NULL;
  `)
}
