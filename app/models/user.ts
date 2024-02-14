import { DateTime } from 'luxon'

import { BaseModel, column } from '@adonisjs/lucid/orm'

export class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fid: number

  @column()
  declare score: number

  @column()
  declare username: string

  @column()
  declare displayName: string | null

  @column()
  declare profilePictureUrl: string | null | undefined

  @column()
  declare follower_count: number

  @column()
  declare following_count: number

  @column()
  declare active_farcaster_badge: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
