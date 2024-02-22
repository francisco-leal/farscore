import { BaseCommand, args } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import env from "#start/env";

import { User } from "#models/user";
import { MintPassport } from "#services/talent_protocol/mint_passport";

export default class CreatePassport extends BaseCommand {
	static commandName = "web3:create-passport";
	static description = "Command to create a passport for the user.";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string()
	declare userId: string;

	async run() {
		var startDate = new Date();

		this.logger.info(
			`Starting creation of passport for user id: ${this.userId}`,
		);

		const user = await User.find(this.userId);

		if (!user) {
			return;
		}

		const result = await MintPassport(user);

		console.log(result);

		console.log("Wait one minute for passport creation");
		await new Promise((r) => setTimeout(r, 80000));

		const apiURL = env.get("TALENT_PROTOCOL_API_URL");
		const url = new URL(`${apiURL}/passports/get_from_credential`);
		url.searchParams.set("source", "farcaster");
		url.searchParams.set("identifier", user.fid.toString());
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": env.get("TALENT_PROTOCOL_API_KEY"),
			},
		});

		const body = await response.json();
		console.log("response", body); // parses JSON response into native JavaScript objects

		var endDate = new Date();

		this.logger.info(
			`Passport id: ${body?.passport?.passport_id} - it took ${(endDate.getTime() - startDate.getTime()) / 1000}`,
		);
	}
}
