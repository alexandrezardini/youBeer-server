import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('ales', table => {
    table.increments('id').primary();
    table.string('ale_type').notNullable();
    table.string('ales').notNullable();

    table
      .integer('recipe_id')
      .notNullable()
      .references('id')
      .inTable('recipes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('ales');
}
