import env from "#start/env";

import PassportContract from "./passport.json" with { type: "json" };

import { ethers } from "ethers";
import { createSmartAccountClient } from "@biconomy/account";
import { PaymasterMode } from "@biconomy/paymaster";

import { generateWallets } from "#services/generate_wallets";

import { User } from "#models/user";

export const createPassport = async (userId: number) => {
  const user = await User.find(userId);

  if (!user) {
    return { created: false, error: "User not found" };
  }

  const result = await generateWallets(userId);

  if (!result.externallyOwnedAccount) {
    console.error("Missing wallet");
    return;
  }

  // Your configuration with private key and Biconomy API key
  const config = {
    privateKey: result.externallyOwnedAccount.privateKey,
    biconomyPaymasterApiKey: env.get("PAYMASTER_API_KEY"),
    bundlerUrl: env.get("BUNDLER_URL"),
    rpcUrl: env.get("JSON_RPC_URL"),
    passportContractAddress: env.get("PASSPORT_CONTRACT_ADDRESS")
  };

  console.log("Config", config);

  // Generate EOA from private key using ethers.js
  let provider = new ethers.JsonRpcProvider(config.rpcUrl);
  let signer = new ethers.Wallet(config.privateKey, provider);

  // Create Biconomy Smart Account instance
  const smartAccount = await createSmartAccountClient({
    signer,
    biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
    bundlerUrl: config.bundlerUrl
  });

  console.log("SCA Address", await smartAccount.getAddress());

  const passportContract = new ethers.Contract(config.passportContractAddress, PassportContract.abi, provider);

  const minTx = await passportContract.create.populateTransaction();
  const tx = {
    to: config.passportContractAddress,
    data: minTx.data
  };

  // Send the transaction and get the transaction hash
  const userOpResponse = await smartAccount.sendTransaction(tx, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED }
  });
  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("Transaction Hash", transactionHash);
  const userOpReceipt = await userOpResponse.wait();
  if (userOpReceipt.success == "true") {
    console.log("UserOp receipt", userOpReceipt);
    console.log("Transaction receipt", userOpReceipt.receipt);
  }

  return { transactionHash, created: true };
};
