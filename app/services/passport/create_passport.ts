import env from "#start/env";
import { DateTime } from "luxon";

import PassportContract from "./passport.json" with { type: "json" };

import { ethers } from "ethers";
import { createSmartAccountClient } from "@biconomy/account";
import { PaymasterMode } from "@biconomy/paymaster";

import { generateWallets } from "#services/generate_wallets";

import { User } from "#models/user";
import { Passport } from "#models/passport";

export const createPassport = async (userId: number) => {
	const user = await User.find(userId);

	if (!user) {
		return { passport: null, created: false, error: "User not found" };
	}

	let passport = await Passport.query().where("user_id", userId).first();

	if (passport) {
		return { passport, created: false, error: "Passport already exists" };
	}

	const walletsResult = await generateWallets(userId);

	if (
		!walletsResult.externallyOwnedAccount ||
		!walletsResult.smartContractAccount
	) {
		console.error("Missing wallets");
		return { passport, created: false, error: "Wallets not created." };
	}

	// Your configuration with private key and Biconomy API key
	const config = {
		privateKey: walletsResult.externallyOwnedAccount.privateKey,
		walletAddress: walletsResult.smartContractAccount.publicAddress,
		biconomyPaymasterApiKey: env.get("PAYMASTER_API_KEY"),
		bundlerUrl: env.get("BUNDLER_URL"),
		rpcUrl: env.get("JSON_RPC_URL"),
		passportContractAddress: env.get("PASSPORT_CONTRACT_ADDRESS"),
	};

	// Generate EOA from private key using ethers.js
	let provider = new ethers.JsonRpcProvider(config.rpcUrl);
	let signer = new ethers.Wallet(config.privateKey, provider);

	// Create Biconomy Smart Account instance
	const smartAccount = await createSmartAccountClient({
		signer,
		biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
		bundlerUrl: config.bundlerUrl,
	});

	const passportContract = new ethers.Contract(
		config.passportContractAddress,
		PassportContract.abi,
		provider,
	);

	const minTx = await passportContract.create.populateTransaction();
	const tx = {
		to: config.passportContractAddress,
		data: minTx.data,
	};

	// Send the transaction and get the transaction hash
	const userOpResponse = await smartAccount.sendTransaction(tx, {
		paymasterServiceData: { mode: PaymasterMode.SPONSORED },
	});
	const { transactionHash } = await userOpResponse.waitForTxHash();

	if (!transactionHash) {
		console.error("Something went wrong. Unable to fetch transaction");
		return { passport, created: false, error: "Missing transaction hash." };
	}

	const userOpReceipt = await userOpResponse.wait();

	if (userOpReceipt.success != "true") {
		console.error("Unable to create passport. UserOp failed.");
		return { passport, created: false, error: "userOp was not successful." };
	}

	const txBlockNumber = userOpReceipt.receipt.blockNumber;
	const txBlock = await provider.getBlock(txBlockNumber);

	const blockTimestamp = txBlock?.timestamp;

	passport = new Passport();
	passport.passportId = await passportContract.passportId(config.walletAddress);
	passport.userId = userId;
	passport.transactionHash = transactionHash;
	if (blockTimestamp) {
		const jsDate = new Date(blockTimestamp * 1000);
		passport.transactionTimestamp = DateTime.fromJSDate(jsDate);
	}
	await passport.save();

	return { passport, created: true };
};
