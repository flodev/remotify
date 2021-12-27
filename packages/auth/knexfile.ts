// Update with your config settings.

const databaseName = 'postgres';
// const pg = require("pg");

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const connection =
  process.env.DATABASE_URL ||
  `postgres://postgres:@localhost:5432/${databaseName}`;

module.exports = {
  client: 'pg',
  connection: () => {
    console.log('returning conneciton string', process.env.DATABASE_URL);
    return process.env.DATABASE_URL;
  },
  migrations: {
    directory: __dirname + '/db/migrations',
    extension: process.env.KNEX_MIGRATION_FILE_EXTENSION || 'js',
  },
};
