/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from "@adonisjs/core/env";

export default await Env.create(new URL("../", import.meta.url), {
	NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	HOST: Env.schema.string({ format: "host" }),
	LOG_LEVEL: Env.schema.string(),

	/*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
	SESSION_DRIVER: Env.schema.enum(["cookie", "memory"] as const),

	/*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
	DB_HOST: Env.schema.string({ format: "host" }),
	DB_PORT: Env.schema.number(),
	DB_USER: Env.schema.string(),
	DB_PASSWORD: Env.schema.string.optional(),
	DB_DATABASE: Env.schema.string(),

	MERKLE_ROOT_SECRET: Env.schema.string(),

	/*
  |----------------------------------------------------------
  | Variables for configuring encryption
  |----------------------------------------------------------
  */

	WALLET_PRIVATE_KEY_SECRET: Env.schema.string(),

	/*
  |----------------------------------------------------------
  | Variables for web3
  |----------------------------------------------------------
  */
	JSON_RPC_URL: Env.schema.string(),
	BUNDLER_URL: Env.schema.string(),
	PASSPORT_CONTRACT_ADDRESS: Env.schema.string(),
	PAYMASTER_URL: Env.schema.string(),

	/*
  |----------------------------------------------------------
  | Talent Protocol API
  |----------------------------------------------------------
  */
	TALENT_PROTOCOL_API_KEY: Env.schema.string(),
	TALENT_PROTOCOL_API_URL: Env.schema.string(),
});
