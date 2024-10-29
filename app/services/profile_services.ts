import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfileService {
  constructor(protected ctx: HttpContext) {}

  async find() {
    return this.ctx.auth.user!.related('profile').query().firstOrFail()
  }
}
