import { UserFactory } from './user_factory.js'
import Profile from '#models/profile'
import factory from '@adonisjs/lucid/factories'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      //userId: 1,
      description: faker.lorem.paragraphs(),
    }
  })
  .relation('user', () => UserFactory)
  .build()
