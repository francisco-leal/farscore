import { BaseCommand, args } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import { createPassport } from "#services/passport/create_passport";

export default class CreatePassport extends BaseCommand {
  static commandName = "web3:create-passport";
  static description = "Command to create a passport for the user.";

  static options: CommandOptions = {
    startApp: true
  };

  @args.string()
  declare userId: string;

  async run() {
    this.logger.info(`Starting creation of passport for user id: ${this.userId}`);

    const result = await createPassport(Number(this.userId));

    this.logger.info(`Transaction Hash: ${result?.transactionHash}`);
  }
}
