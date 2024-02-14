import type { HttpContext } from '@adonisjs/core/http'
import { generateImage } from '#services/generate_image';
import sharp from "sharp";

export default class ImagesController {
  async show({ params, response }: HttpContext) {
    const svg = await generateImage(params.id);
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    response.header('Content-type', 'image/png');
    response.header('Cache-Control', 'max-age=10');
    return response.send(pngBuffer);
  }
}
