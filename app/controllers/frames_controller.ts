import { type HttpContext } from '@adonisjs/core/http'
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit'
import { User } from '#models/user'
import { Connection } from '#models/connection'
import { scoreForUser } from '#services/score/calculate'

const BASE_FID = 195255
const REDIRECT_URL =
  'https://talentprotocol.notion.site/FAQ-FarScout-5dfa30d2aa374ef687d1b1489af9cebd?pvs=4'

export default class FramesController {
  async index({ view }: HttpContext) {
    const fid = BASE_FID

    const user = await User.query().where('fid', fid).first()

    if (!user) {
      console.log('No user found')
      return view.render('pages/error')
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  }

  async main({ view, request, response }: HttpContext) {
    const body = request.body() as FrameRequest

    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    })

    if (!isValid) {
      console.log('Invalid frame message')
      return view.render('pages/error')
    }

    const { fid } = message.interactor

    const user = await User.query().where('fid', fid).first()

    if (message.button === 2) {
      return response.redirect().toPath(REDIRECT_URL)
    }

    if (!user) {
      console.log('No user found')
      return view.render('pages/score', { score: 0, fid: -1 })
    }

    if (user.score === 0) {
      const score = await scoreForUser(user)
      user.score = score
      user.save()
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  }

  async score({ view, request, response }: HttpContext) {
    const body = request.body() as FrameRequest

    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    })

    if (!isValid) {
      console.log('Invalid frame message')
      return view.render('pages/error')
    }

    const { fid } = message.interactor

    if (message.button === 1) {
      // search
      return view.render('pages/search')
    } else if (message.button === 2) {
      // leaderboard
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5)
      return view.render('pages/leaderboard', { topUsers })
    } else if (message.button === 3) {
      // top followers
      const topUsers = await User.query()
        .whereIn('fid', Connection.query().where('target_fid', fid).select('source_fid'))
        .orderBy('score', 'desc')
        .limit(5)

      return view.render('pages/top_followers', { topUsers, fid })
    } else if (message.button === 4) {
      return response.redirect().toPath(REDIRECT_URL)
    }
  }

  async followers({ view, request, response }: HttpContext) {
    const body = request.body() as FrameRequest

    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    })

    if (!isValid) {
      console.log('Invalid frame message')
      return view.render('pages/error')
    }

    const { fid } = message.interactor

    if (message.button === 1) {
      // my score
      const user = await User.query().where('fid', fid).first()

      if (!user) {
        console.log('No user found')
        return view.render('pages/error')
      }

      if (user.score === 0) {
        const score = await scoreForUser(user)
        user.score = score
        user.save()
      }

      return view.render('pages/score', { score: user.score, fid: user.fid })
    } else if (message.button === 2) {
      // leaderboard
      const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5)
      return view.render('pages/leaderboard', { topUsers })
    } else if (message.button === 3) {
      // search
      return view.render('pages/search')
    } else if (message.button === 4) {
      return response.redirect().toPath(REDIRECT_URL)
    }
  }

  async leaderboard({ view, request, response }: HttpContext) {
    const body = request.body() as FrameRequest

    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    })

    if (!isValid) {
      console.log('Invalid frame message')
      return view.render('pages/error')
    }

    const { fid } = message.interactor

    if (message.button === 1) {
      // my score
      const user = await User.query().where('fid', fid).first()

      if (!user) {
        console.log('No user found')
        return view.render('pages/error')
      }

      if (user.score === 0) {
        const score = await scoreForUser(user)
        user.score = score
        user.save()
      }

      return view.render('pages/score', { score: user.score, fid: user.fid })
    } else if (message.button === 2) {
      // top followers
      const topUsers = await User.query()
        .whereIn('fid', Connection.query().where('target_fid', fid).select('source_fid'))
        .orderBy('score', 'desc')
        .limit(5)

      return view.render('pages/top_followers', { topUsers, fid })
    } else if (message.button === 3) {
      // search
      return view.render('pages/search')
    } else if (message.button === 4) {
      return response.redirect().toPath(REDIRECT_URL)
    }
  }

  async search({ view, request }: HttpContext) {
    const body = request.body() as FrameRequest

    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    })

    if (!isValid) {
      console.log('Invalid frame message')
      return view.render('pages/error')
    }

    const user = await User.findBy('username', message.input)

    if (!user) {
      console.log('No user found')
      return view.render('pages/error')
    }

    return view.render('pages/score', { score: user.score, fid: user.fid })
  }
}
