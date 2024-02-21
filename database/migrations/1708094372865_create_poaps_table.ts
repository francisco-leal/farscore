import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "poaps";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table.integer("user_id").unsigned().notNullable();

			table.string("collection_name").notNullable();

			table.string("poap_id").notNullable().unique();
			table.integer("chain_id").notNullable();
			table.integer("event_id").notNullable();
			table.integer("token_id").notNullable();
			table.string("token_address");
			table.string("token_uri");
			table.timestamp("minted_at");

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
		this.schema.dropTable(this.tableName);
	}
}
