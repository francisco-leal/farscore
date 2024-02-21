import { BaseCommand, args } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import { fetchPoaps } from "#services/fetch_poaps";
import { User } from "#models/user";
import { Poap } from "#models/poap";

export default class SyncFarcasterUserPoaps extends BaseCommand {
	static commandName = "sync:farcaster-user-poaps";
	static description = "Sync all ETH Global poaps of farcaster user.";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string()
	declare farcasterId: string;

	poapCollections = {
		"159576": "ETHGlobal Istanbul Hacker",
		"146353": "ETHGlobal Paris 2023 Hacker",
		"127282": "ETHGlobal Lisbon 2023 Staked Hacker",
		"156931": "ETH Lisbon 2023",
		"103093": "ETHDenver 2023",
	};

	async run() {
		this.logger.info(
			`Starting sync of poaps for farcaster id: ${this.farcasterId}`,
		);

		const user = await User.query().where("fid", this.farcasterId).first();

		if (!user) {
			this.logger.info(`Missing user with fid: ${this.farcasterId}`);
			return;
		}

		const poapEventIds = Object.keys(this.poapCollections);
		const poapsData = await fetchPoaps(Number(this.farcasterId), poapEventIds);

		this.logger.info(`${poapsData.length} Found`);

		for (const poapData of poapsData) {
			let poap = await user
				.related("poaps")
				.query()
				.where("poap_id", poapData.id)
				.first();
			const eventId: keyof typeof this.poapCollections = poapData.eventId;
			const collectionName = this.poapCollections[eventId];

			if (poap) {
				this.logger.info(`Poap: ${poapData.id} already stored`);
			} else {
				poap = new Poap();
				poap.userId = user.id;
				poap.collectionName = collectionName;
				poap.poapId = poapData.id;
				poap.chainId = poapData.chainId;
				poap.eventId = poapData.eventId;
				poap.tokenId = poapData.tokenId;
				poap.tokenAddress = poapData.tokenAddress;
				poap.tokenUri = poapData.tokenUri;
				poap.mintedAt = poapData.createdAtBlockTimestamp;
				await poap.save();
			}
		}
	}
}
