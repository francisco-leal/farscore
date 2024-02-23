import env from '#start/env'

import { ethers } from 'ethers'
import { createSmartAccountClient } from '@biconomy/account'

import { User } from '#models/user'
import { Wallet } from '#models/wallet'

import db from '@adonisjs/lucid/services/db'

export const generateWallets = async (userId: number) => {
  const user = await User.find(userId)

  if (!user) {
    return { generated: false, error: 'User not found' }
  }

  let externallyOwnedAccount = await Wallet.query()
    .where('user_id', userId)
    .where('wallet_type', 'externally_owned_account')
    .first()
  let smartContractAccount = await Wallet.query()
    .where('user_id', userId)
    .where('wallet_type', 'smart_contract_account')
    .first()

  if (externallyOwnedAccount && smartContractAccount) {
    return {
      externallyOwnedAccount,
      smartContractAccount,
      generated: false,
      error: 'Wallets already generated.',
    }
  }

  await db.transaction(async (trx) => {
    let ethersWallet = ethers.Wallet.createRandom()
    const provider = new ethers.JsonRpcProvider(env.get('JSON_RPC_URL'))
    ethersWallet = ethersWallet.connect(provider)

    externallyOwnedAccount = new Wallet()
    externallyOwnedAccount.userId = user.id
    externallyOwnedAccount.publicAddress = ethersWallet.address
    externallyOwnedAccount.walletType = 'externally_owned_account'
    externallyOwnedAccount.privateKey = ethersWallet.privateKey
    externallyOwnedAccount.mnemonic = ethersWallet.mnemonic?.phrase

    externallyOwnedAccount.useTransaction(trx)
    await externallyOwnedAccount.save()

    const biconomySmartAccount = await createSmartAccountClient({
      signer: ethersWallet,
      bundlerUrl: env.get('BUNDLER_URL'),
    })

    smartContractAccount = new Wallet()
    smartContractAccount.userId = user.id
    smartContractAccount.walletType = 'smart_contract_account'
    smartContractAccount.publicAddress = await biconomySmartAccount.getAccountAddress()

    smartContractAccount.useTransaction(trx)
    await smartContractAccount.save()
  })

  return { externallyOwnedAccount, smartContractAccount, generated: true }
}
