import ProfileService from '#services/profile_services'
import { profileUpdateValidator } from '#validators/profile'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfilesController {
  constructor(protected profileService: ProfileService) {}

  async edit({ view }: HttpContext) {
    const profile = await this.profileService.find()
    return view.render('pages/profiles/edit', { profile })
  }

  async update({ request, response, auth }: HttpContext) {
    const { fullName, description } = await request.validateUsing(profileUpdateValidator)

    const profile = await this.profileService.find()
    await profile.merge({ description }).save()

    await auth.user!.merge({ fullName }).save()

    return response.redirect().back()
  }
}
