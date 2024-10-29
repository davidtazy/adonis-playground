import Profile from '#models/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async edit({ view, auth }: HttpContext) {
    const user = auth.user!

    const profile = await user.related('profile').query().firstOrFail()

    view.render('pages/profiles/edit', { profile })
  }
}
