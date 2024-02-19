import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'
import { Connection } from '#models/connection'
import { Cast } from '#models/cast'

export default class SyncScores extends BaseCommand {
  static commandName = 'sync:scores'
  static description = 'Sync scores for users'

  static options: CommandOptions = {
    startApp: true
  }

  calculateCastScore(cast: Cast) {
    let score = 0;
    score += cast.replies_count * 1.2
    score += cast.reactions_count
    score += cast.recasts_count
    score += cast.watches_count
    score += cast.quotes_count * 1.5
    if (cast.content.includes('$DEGEN')) {
      score = score * 1.2
    }
    return score
  }

  calculateCastsScore(casts: Cast[]) {
    if (casts.length === 0) {
      return 0;
    }

    const score = casts.reduce((acc, cast) => {
      return acc + this.calculateCastScore(cast)
    }, 0)
    return score / casts.length;
  }

  calculateConnectionScore(connections: Connection[]) {
    if (connections.length <= 0) {
      return 0;
    }
    return Math.log2(connections.length);
  }

  async run() {
    this.logger.info('Starting score calculation')
    let page = 1

    while(true) {
      const users = await User.query().orderBy('id', "desc").forPage(page, 100)
      // const users = await User.query().where('fid', 'in', [195255, 3, 2, 221216, 8446])
      if(!users || users.length === 0) {
        break;
      }
      page += 1;

      for(let user of users) {
        const casts = await Cast.query().where('user_id', user.id).orderBy('id', 'desc').limit(100)
        const castScore = this.calculateCastsScore(casts)

        const connections = await Connection.query().where('target_fid', user.fid)
        const connectionScore = this.calculateConnectionScore(connections)

        const totalScore = (castScore + connectionScore) * (user.active_farcaster_badge ? 1.2 : 1)

        this.logger.info(`Processing scores for ${user.username} -> Cast Score: ${castScore}, Connection Score: ${connectionScore}, Total Score: ${totalScore}`)
      }
    }
  }
}