import { DateTime } from "luxon";
import { BaseModel, column } from "@adonisjs/lucid/orm";
import env from "#start/env";

import { Encryption } from "@adonisjs/core/encryption";

const privateKeyEncryption = new Encryption({
	secret: env.get("WALLET_PRIVATE_KEY_SECRET"),
});

export class Wallet extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare userId: number;

	@column()
	declare publicAddress: string;

	// It can be a EOA or a SCA
	@column()
	declare walletType: string;

	@column({
		consume: (value?: Buffer) =>
			!value ? null : privateKeyEncryption.decrypt(value.toString()),
		prepare: (value?: unknown) =>
			!value ? null : privateKeyEncryption.encrypt(value),
	})
	declare privateKey: string;

	@column({
		consume: (value?: Buffer) =>
			!value ? null : privateKeyEncryption.decrypt(value.toString()),
		prepare: (value?: unknown) =>
			!value ? null : privateKeyEncryption.encrypt(value),
	})
	declare mnemonic: string | null | undefined;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
