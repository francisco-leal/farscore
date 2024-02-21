import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";

export class Poap extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare userId: number;

	@column()
	declare collectionName: string;

	@column()
	declare poapId: number;

	@column()
	declare chainId: number;

	@column()
	declare eventId: number;

	@column()
	declare tokenId: number;

	@column()
	declare tokenAddress: string | null;

	@column()
	declare tokenUri: string | null;

	@column.dateTime()
	declare mintedAt: DateTime | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
