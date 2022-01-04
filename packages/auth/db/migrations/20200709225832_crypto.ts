exports.up = function (knex, Promise) {
  return knex.schema.raw(`
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);
};

exports.down = function (knex, Promise) {
  return Promise.resolve();
};
