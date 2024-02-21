import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "wallets";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.integer("user_id").unsigned().notNullable();

			table.enu(
				"wallet_type",
				["smart_contract_account", "externally_owned_account"],
				{
					useNative: true,
					enumName: "wallet_types",
					existingType: false,
					schemaName: "public",
				},
			);

			table.string("public_address").notNullable();
			table.string("private_key");
			table.string("mnemonic");

			table.timestamp("created_at");
			table.timestamp("updated_at");

			table
				.foreign("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
		});
	}

	async down() {
		this.schema.raw('DROP TYPE IF EXISTS "wallet_types";');
		this.schema.dropTable(this.tableName);
	}
}
