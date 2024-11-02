import Profile from '#models/profile'
import User from '#models/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_missing_user_profiles'

  async up() {
    //create profiles for any users missing one

    this.defer(async (db) => {
      const users = await User.query()
        .whereDoesntHave('profile', (query) => query)
        .select('id')

      console.log(`${users.length} users missing a profiles`)

      const profiles = users.map((user) => ({ userId: user.id }))

      await Profile.createMany(profiles)
    })
  }

  async down() {}
}
