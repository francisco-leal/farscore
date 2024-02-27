import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { scoreForUser } from '#services/score/calculate'

export default class SyncScores extends BaseCommand {
  static commandName = 'sync:scores'
  static description = 'Sync scores for users'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare farcasterId: string

  async run() {
    this.logger.info('Starting score calculation')
    let processedUsers = 0

    let users

    if (this.farcasterId !== '-1') {
      users = await User.query().where('fid', this.farcasterId)
    } else {
      users = await User.query().orderBy('id', 'desc')
    }

    this.logger.info(`Total users: ${users.length}`)

    for (let user of users) {
      processedUsers += 1

      const score = await scoreForUser(user)
      user.score = score
      await user.save()

      this.logger.info(
        `Processing scores for #${processedUsers} ${user.username} -> Score: ${score}`
      )
    }
  }
}
