import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigint('fid').notNullable().unique()
      table.bigInteger('score')
      table.string('username')
      table.string('displayName')
      table.string('profile_picture_url')
      table.integer('follower_count')
      table.integer('following_count')
      table.boolean('active_farcaster_badge')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}