import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "passports";

  async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments("id");

      table.integer("user_id").unsigned().notNullable();

      table.string("transaction_hash").notNullable();
      table.integer("passport_id").notNullable();
      table.timestamp("transaction_timestamp");

      table.timestamp("created_at");
      table.timestamp("updated_at");

      table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
