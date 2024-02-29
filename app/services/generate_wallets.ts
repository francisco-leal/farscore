import env from "#start/env";

import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";

import { privateKeyToSimpleSmartAccount } from "permissionless/accounts";

import { User } from "#models/user";
import { Wallet } from "#models/wallet";

import db from "@adonisjs/lucid/services/db";

const ENTRYPOINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

export const generateWallets = async (userId: number) => {
	const user = await User.find(userId);

	if (!user) {
		return { generated: false, error: "User not found" };
	}

	let externallyOwnedAccount = await Wallet.query()
		.where("user_id", userId)
		.where("wallet_type", "externally_owned_account")
		.first();
	let smartContractAccount = await Wallet.query()
		.where("user_id", userId)
		.where("wallet_type", "smart_contract_account")
		.first();

	if (externallyOwnedAccount && smartContractAccount) {
		return {
			externallyOwnedAccount,
			smartContractAccount,
			generated: false,
			error: "Wallets already generated.",
		};
	}

	await db.transaction(async (trx) => {
		const privateKey = generatePrivateKey();
		const account = privateKeyToAccount(privateKey);

		externallyOwnedAccount = new Wallet();
		externallyOwnedAccount.userId = user.id;
		externallyOwnedAccount.publicAddress = account.address;
		externallyOwnedAccount.walletType = "externally_owned_account";
		externallyOwnedAccount.privateKey = privateKey;

		externallyOwnedAccount.useTransaction(trx);
		await externallyOwnedAccount.save();

		const publicClient = createPublicClient({
			transport: http(env.get("JSON_RPC_URL")),
		});

		const smartAccount = await privateKeyToSimpleSmartAccount(publicClient, {
			privateKey,
			entryPoint: ENTRYPOINT, // global entrypoint
			factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
		});

		smartContractAccount = new Wallet();
		smartContractAccount.userId = user.id;
		smartContractAccount.walletType = "smart_contract_account";
		smartContractAccount.publicAddress = await smartAccount.address;

		smartContractAccount.useTransaction(trx);
		await smartContractAccount.save();
	});

	return { externallyOwnedAccount, smartContractAccount, generated: true };
};
