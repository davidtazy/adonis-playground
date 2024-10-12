import cache from '#services/cache_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class RedisController {
  async destroy({ response, params }: HttpContext) {
    await cache.delete(params.slug)
    return response.redirect().back()
  }

  async flush({ response }: HttpContext) {
    console.log('flushing redis DB')
    await cache.flushDB()
    return response.redirect().back()
  }
}
