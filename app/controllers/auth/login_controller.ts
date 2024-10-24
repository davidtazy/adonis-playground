import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, auth }: HttpContext) {
    // 1. Grab the data from the request and validate
    const { email, password, isRememberMe } = await request.validateUsing(loginValidator)

    // 2. Verify credentials
    const user = await User.verifyCredentials(email, password)

    // 3. Login the user
    await auth.use('web').login(user, isRememberMe)

    // 4. Redirect to the home page
    return response.redirect().toRoute('home')
  }
}
