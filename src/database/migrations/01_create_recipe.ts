import Knex from 'knex'

export async function up(knex: Knex) {
    return knex.schema.createTable('recipes', table => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('recipe').notNullable()
        table.integer('likes').notNullable()

        table
        .integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('recipes')
}