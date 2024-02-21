import { BaseCommand, args } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import { generateWallets } from "#services/generate_wallets";

export default class GenerateUserWallet extends BaseCommand {
	static commandName = "web3:generate-user-wallet";
	static description = "Command to test wallet generation for a user.";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string()
	declare userId: string;

	async run() {
		this.logger.info(
			`Starting generation of wallets for user id: ${this.userId}`,
		);

		const result = await generateWallets(Number(this.userId));

		if (result["error"]) {
			this.logger.error(`Error: ${result["error"]}`);
		}

		this.logger.info(
			`EOA address: ${result["externallyOwnedAccount"]?.publicAddress}`,
		);
		this.logger.info(
			`SCA address: ${result["smartContractAccount"]?.publicAddress}`,
		);
	}
}
