import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async handle({ view }: HttpContext) {
    return view.render('pages/admin/dashboard')
  }
}
