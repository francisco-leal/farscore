import env from "#start/env";
import PassportContract from "./passport.json" with { type: "json" };

import { createSmartAccountClient } from "permissionless";
import { createPublicClient, http, encodeFunctionData } from "viem";
import { privateKeyToSimpleSmartAccount } from "permissionless/accounts";
import { baseSepolia } from "viem/chains";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";

import { generateWallets } from "#services/generate_wallets";

import { User } from "#models/user";
import { Passport } from "#models/passport";

const ENTRYPOINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

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

	// Your configuration with private key
	const config = {
		privateKey: walletsResult.externallyOwnedAccount.privateKey,
		walletAddress: walletsResult.smartContractAccount.publicAddress,
		paymasterUrl: env.get("PAYMASTER_URL"),
		bundlerUrl: env.get("BUNDLER_URL"),
		rpcUrl: env.get("JSON_RPC_URL"),
		passportContractAddress: env.get("PASSPORT_CONTRACT_ADDRESS"),
	};

	console.log("config", config);

	const publicClient = createPublicClient({
		transport: http(config.rpcUrl),
	});

	const account = await privateKeyToSimpleSmartAccount(publicClient, {
		privateKey: config.privateKey,
		entryPoint: ENTRYPOINT, // global entrypoint
		factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
	});

	console.log("account.address", account.address);

	const paymasterClient = createPimlicoPaymasterClient({
		transport: http(config.paymasterUrl),
		entryPoint: ENTRYPOINT,
		chain: baseSepolia,
	});

	console.log("paymasterClient");

	const smartAccountClient = createSmartAccountClient({
		account,
		chain: baseSepolia,
		bundlerTransport: http(config.rpcUrl),
		// IMPORTANT: Set up the Cloud Paymaster to sponsor your transaction
		middleware: {
			sponsorUserOperation: paymasterClient.sponsorUserOperation,
		},
	});

	console.log("smartAccountClient");

	const callData = encodeFunctionData({
		abi: PassportContract.abi,
		functionName: "create",
		args: [],
	});

	console.log("Generated callData:", callData);

	// Send the sponsored transaction!
	const txHash = await smartAccountClient.sendTransaction({
		account: smartAccountClient.account,
		to: config.passportContractAddress,
		data: callData,
		value: BigInt(0),
	});

	console.log(
		`UserOperation included: https://sepolia.basescan.org/tx/${txHash}`,
	);

	const passportId = await publicClient.readContract({
		address: config.passportContractAddress,
		abi: PassportContract.abi,
		functionName: "passportId",
		args: [config.walletAddress],
	});

	// const transaction = await publicClient.waitForTransactionReceipt({
	// 	hash: txHash,
	// });

	// const txBlockNumber = transaction.blockNumber;
	// const txBlock = await provider.getBlock(txBlockNumber);

	// const blockTimestamp = txBlock?.timestamp;

	passport = new Passport();
	passport.passportId = Number(passportId);
	passport.userId = userId;
	passport.transactionHash = txHash;
	// if (blockTimestamp) {
	// 	const jsDate = new Date(blockTimestamp * 1000);
	// 	passport.transactionTimestamp = DateTime.fromJSDate(jsDate);
	// }
	await passport.save();

	return { passport, created: true };
};
