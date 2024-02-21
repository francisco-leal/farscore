import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up () {
    this.schema.alterTable('connections', (table) => {
      table.index('target_fid', 'connections_target_fid_index')
      table.index('source_fid', 'connections_source_fid_index')
    })

    this.schema.alterTable('users', (table) => {
      table.index('fid', 'users_fid_index')
    })
  }

  async down () {
    this.schema.alterTable('connections', (table) => {
      table.dropIndex('connections_target_fid_index')
      table.dropIndex('connections_source_fid_index')
    })

    this.schema.alterTable('users', (table) => {
      table.dropIndex('users_fid_index')
    })
  }
}
