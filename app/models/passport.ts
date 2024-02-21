import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";

export class Passport extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare userId: number;

  @column()
  declare passportId: number;

  @column()
  declare transactionHash: string;

  @column.dateTime()
  declare transactionTimestamp: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
