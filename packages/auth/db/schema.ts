import Knex from 'knex';
// eslint-disable-next-line
const connection = require('../knexfile');

export const knex = Knex(connection);
