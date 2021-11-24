const defaultRoomTile = require('../../config/defaultRoomTile')

/**
 *
 * @param {Knex} knex
 */
exports.up = function(knex) {
  return knex.schema.alterTable('room', function(t) {
    // drops previous default value from column, change type to string and add not nullable constraint
    t.json('tile').defaultTo(JSON.stringify(defaultRoomTile))
  });
};

exports.down = function(knex) {
  // return Promise.resolve()
  return knex.schema.alterTable('room', function(t) {
    // drops previous default value from column, change type to string and add not nullable constraint
    t.dropColumn('tile')
  });
};
