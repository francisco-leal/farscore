import { DateTime } from "luxon";

import { BaseModel, column } from "@adonisjs/lucid/orm";

export class Cast extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare castHash: string;

	@column()
	declare userId: number;

	@column()
	declare parentCastHash: string | null;

	@column()
	declare content: string;

	@column()
	declare replies_count: number;

	@column()
	declare reactions_count: number;

	@column()
	declare recasts_count: number;

	@column()
	declare watches_count: number;

	@column()
	declare quotes_count: number;

	@column()
	declare timestamp: bigint;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
