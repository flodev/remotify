// Update with your config settings.

const databaseName = 'postgres';
// const pg = require("pg");

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
const connection =
  process.env.DATABASE_URL ||
  `postgres://postgres:@localhost:5432/${databaseName}`;

module.exports = {
  client: 'pg',
  connection,
  migrations: {
    directory: __dirname + '/db/migrations',
    extension: process.env.KNEX_MIGRATION_FILE_EXTENSION || 'js',
  },
};
