import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'casts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cast_hash', 42).notNullable().unique()
      table.bigInteger('user_id').unsigned().notNullable()
      table.string('parent_cast_hash', 42)
      table.string('content', 320).notNullable()
      table.integer('replies_count').defaultTo(0)
      table.integer('reactions_count').defaultTo(0)
      table.integer('recasts_count').defaultTo(0)
      table.integer('watches_count').defaultTo(0)
      table.integer('quotes_count').defaultTo(0)
      table.timestamp('timestamp').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.index('cast_hash', 'cast_hash_index')
      table.index('parent_cast_hash', 'parent_cast_hash_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}