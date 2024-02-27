import { User } from '#models/user'
import { Cast } from '#models/cast'
import { Poap } from '#models/poap'

const calculateCastScore = (cast: Cast) => {
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

const calculateCastsScore = (casts: Cast[]) => {
  if (casts.length === 0) {
    return 0
  }

  const score = casts.reduce((acc, cast) => {
    return acc + calculateCastScore(cast)
  }, 0)
  return score / casts.length
}

const calculateConnectionScore = (follower_count: number) => {
  return Math.log2(follower_count)
}

const calculatePoapsScore = (poaps: Poap[]) => {
  return poaps.length
}

export const scoreForUser = async (user: User) => {
  const casts = await Cast.query().where('user_id', user.id).orderBy('id', 'desc').limit(500)
  const castScore = calculateCastsScore(casts) * 10

  const connectionScore = calculateConnectionScore(user.follower_count)

  const poaps = await Poap.query().where('user_id', user.id)
  const poapScore = calculatePoapsScore(poaps) * 10

  const totalScore =
    (castScore + connectionScore + poapScore) * (user.active_farcaster_badge ? 1.2 : 1)

  return Math.round(totalScore)
}
