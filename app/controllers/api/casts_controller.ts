import type { HttpContext } from '@adonisjs/core/http'
import { Cast } from '#models/cast';

export default class APICastsController {
  /**
   * Return list of all posts or paginate through them
   */
  async index({}: HttpContext) {
    const casts = await Cast.all();
    return casts;
  }

  /**
   * Display a single post by id.
   */
  async show({params }: HttpContext) {
    const cast = await Cast.findBy('castHash', params.id);

    if (!cast) {
      throw new Error('Cast not found');
    }
    return cast;
  }
}
