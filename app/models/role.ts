import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //@hasMany(() => User)
  //declare user: HasMany<typeof User>

  @hasMany(() => User, {
    localKey: 'id',
    foreignKey: 'roleId', //from user table
  })
  declare user: HasMany<typeof User>
}
