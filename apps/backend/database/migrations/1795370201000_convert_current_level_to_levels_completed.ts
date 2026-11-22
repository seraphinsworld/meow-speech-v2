import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_unit_progress'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('levels_completed').unsigned().notNullable().defaultTo(0)
    })

    this.defer(async (db) => {
      await db.rawQuery(
        'UPDATE user_unit_progress SET levels_completed = CASE WHEN current_level > 0 THEN current_level - 1 ELSE 0 END'
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('current_level')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('current_level').unsigned().notNullable().defaultTo(1)
    })

    this.defer(async (db) => {
      await db.rawQuery('UPDATE user_unit_progress SET current_level = levels_completed + 1')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('levels_completed')
    })
  }
}
