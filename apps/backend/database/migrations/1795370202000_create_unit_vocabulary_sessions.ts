import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('user_unit_progress', (table) => {
      table.integer('completed_rounds').unsigned().notNullable().defaultTo(0)
    })

    this.schema.createTable('user_unit_words', (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('unit_id').unsigned().notNullable()
      table.string('word').notNullable()
      table.string('state').notNullable().defaultTo('unseen')
      table.integer('step').unsigned().notNullable().defaultTo(0)
      table.bigInteger('next_due_at').nullable()
      table.bigInteger('last_reviewed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['user_id', 'unit_id', 'word'])
      table.index(['user_id', 'unit_id', 'state'])
      table.index(['user_id', 'unit_id', 'next_due_at'])
    })

    this.schema.createTable('unit_round_sessions', (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('unit_id').unsigned().notNullable()
      table.integer('level').unsigned().notNullable()
      table.integer('current_round').unsigned().notNullable()
      table.string('seed').notNullable()
      table.text('scheduled_words').notNullable()
      table.string('state').notNullable().defaultTo('active')
      table.timestamp('created_at').notNullable()
      table.timestamp('completed_at').nullable()
      table.index(['user_id', 'unit_id', 'state'])
    })

    this.schema.raw(`
      CREATE UNIQUE INDEX unit_round_sessions_one_active_per_unit
      ON unit_round_sessions (user_id, unit_id)
      WHERE state = 'active'
    `)
  }

  async down() {
    this.schema.raw('DROP INDEX unit_round_sessions_one_active_per_unit')
    this.schema.dropTable('unit_round_sessions')
    this.schema.dropTable('user_unit_words')
    this.schema.alterTable('user_unit_progress', (table) => table.dropColumn('completed_rounds'))
  }
}
