import type { HttpContext } from '@adonisjs/core/http'
import {
  generateScoreImage,
  generateLeaderboardImage,
  generateFollowersImage,
  generateIntroMessage,
} from '#services/generate_image'
import sharp from 'sharp'

export default class ImagesController {
  async show({ response }: HttpContext) {
    const svg = await generateIntroMessage()
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer()

    response.header('Content-type', 'image/png')
    response.header('Cache-Control', 'max-age=10')
    return response.send(pngBuffer)
  }

  async leaderboard({ response }: HttpContext) {
    const svg = await generateLeaderboardImage()
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer()

    response.header('Content-type', 'image/png')
    response.header('Cache-Control', 'max-age=10')
    return response.send(pngBuffer)
  }

  async followers({ params, response }: HttpContext) {
    const svg = await generateFollowersImage(params.id)
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer()

    response.header('Content-type', 'image/png')
    response.header('Cache-Control', 'max-age=10')
    return response.send(pngBuffer)
  }

  async score({ params, response }: HttpContext) {
    const svg = await generateScoreImage(params.id)
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer()

    response.header('Content-type', 'image/png')
    response.header('Cache-Control', 'max-age=10')
    return response.send(pngBuffer)
  }
}
