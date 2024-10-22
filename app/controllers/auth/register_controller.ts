import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response }: HttpContext) {
    // 1. Grab the data from the request
    const data = request.only(['fullName', 'email', 'password'])

    // 2. Create the user
    const validatorData = await registerValidator.validate(data)
    const user = await User.create(validatorData)
    console.log(user.serialize())

    // 3. Login the user
    //data['password'] = await Hash.make(data['password'])

    //await user.save()

    // 4. Redirect to the home page
    return response.redirect().toRoute('home')
  }
}
