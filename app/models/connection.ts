import { DateTime } from 'luxon'

import { BaseModel, column } from '@adonisjs/lucid/orm'

export class Connection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare targetFid: number

  @column()
  declare sourceFid: number

  @column()
  declare dappName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
