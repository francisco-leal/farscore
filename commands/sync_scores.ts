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

  calculateCastScore(casts: Cast[]) {
    if (casts.length === 0) {
      return 0;
    }

    const score = casts.reduce((acc, cast) => {
      return acc + (cast.replies_count * 1.2)  + cast.reactions_count + cast.recasts_count + cast.watches_count + (cast.quotes_count*1.5)
    }, 0)
    return score / casts.length;
  }

  calculateConnectionScore(connections: Connection[]) {
    this.logger.info(`${connections.length}`)
    return Math.log10(100);
  }

  async run() {
    this.logger.info('Starting score calculation')
    let page = 1

    while(page === 1) {
      // const users = await User.query().orderBy('id', "desc").forPage(page, 100)
      const users = await User.query().where('fid', 'in', [195255, 3, 2, 221216, 8446])
      if(!users || users.length === 0) {
        break;
      }
      page += 1;

      for(let user of users) {
        const casts = await Cast.query().where('user_id', user.id).orderBy('id', 'desc').limit(100)
        const castScore = this.calculateCastScore(casts)

        const connections = await Connection.query().where('target_fid', user.fid)
        const connectionScore = this.calculateConnectionScore(connections)
        // const connectionScore = user.follower_count / 100

        // TOTAL_SCORE = 0.5 * CAST_SCORE + 0.3 * CONNECTION_SCORE + 0.2 AIRSTACK (POAPs, NFTs)
        // TOTAL_SCORE * 1.2 if active on farcaster
        // TOTAL_SCORE * 1.2 if fid < 20 000

        const totalScore = (castScore*25 + connectionScore) * (user.active_farcaster_badge ? 1.2 : 1)

        // user.score = (castScore + connectionScore)
        // if (user.active_farcaster_badge) {
        //   user.score = user.score * 1.2
        // }
        // await user.save()
        this.logger.info(`Processing scores for ${user.username} -> Cast Score: ${castScore}, Connection Score: ${connectionScore}, Total Score: ${totalScore}`)
      }
    }
  }
}