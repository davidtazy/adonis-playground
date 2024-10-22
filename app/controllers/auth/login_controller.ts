import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response }: HttpContext) {
    // 1. Grab the data from the request and validate
    const data = await request.validateUsing(loginValidator)

    // 2 Login the user

    // 3. Redirect to the home page
    return response.redirect().toRoute('home')
  }
}
