import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'

export default class ResetScores extends BaseCommand {
  static commandName = 'reset:scores'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "ResetScores"')
    await User.query().update({ score: 0 })
  }
}
