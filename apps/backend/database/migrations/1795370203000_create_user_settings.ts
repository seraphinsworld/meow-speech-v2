import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.boolean('auto_validate').notNullable().defaultTo(true)
      table.boolean('auto_play_pronunciation').notNullable().defaultTo(false)
      table.boolean('sound_effects_enabled').notNullable().defaultTo(true)
      table.float('sound_effects_volume').notNullable().defaultTo(0.35)
      table.float('pronunciation_volume').notNullable().defaultTo(0.8)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
