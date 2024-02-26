import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { Cast } from '#models/cast'
import { Poap } from '#models/poap'

export default class SyncScores extends BaseCommand {
  static commandName = 'sync:scores'
  static description = 'Sync scores for users'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string()
  declare farcasterId: string

  calculateCastScore(cast: Cast) {
    let score = 0
    score += cast.replies_count * 1.2
    score += cast.reactions_count
    score += cast.recasts_count
    score += cast.watches_count
    score += cast.quotes_count * 1.5
    if (cast.content.includes('$DEGEN')) {
      score = score * 1.05
    }
    return score
  }

  calculateCastsScore(casts: Cast[]) {
    if (casts.length === 0) {
      return 0
    }

    const score = casts.reduce((acc, cast) => {
      return acc + this.calculateCastScore(cast)
    }, 0)
    return score / casts.length
  }

  calculateConnectionScore(follower_count: number) {
    return Math.log2(follower_count)
  }

  calculatePoapsScore(poaps: Poap[]) {
    return poaps.length
  }

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
      const casts = await Cast.query().where('user_id', user.id).orderBy('id', 'desc').limit(500)
      const castScore = this.calculateCastsScore(casts) * 10

      const connectionScore = this.calculateConnectionScore(user.follower_count)

      const poaps = await Poap.query().where('user_id', user.id)
      const poapScore = this.calculatePoapsScore(poaps) * 10

      const totalScore =
        (castScore + connectionScore + poapScore) * (user.active_farcaster_badge ? 1.2 : 1)

      user.score = Math.round(totalScore)
      await user.save()

      this.logger.info(
        `Processing scores for ${user.username} -> Cast Score: ${castScore}, Connection Score: ${connectionScore}, Total Score: ${totalScore}`
      )
    }
  }
}
