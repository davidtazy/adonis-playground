import MovieStatuses from '#enums/movie_statuses'
import { BaseModel, column, scope } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare statusId: number

  @column()
  declare writerId: number

  @column()
  declare directorId: number

  @column()
  declare slug: string

  @column()
  declare title: string

  @column()
  declare summary: string

  @column()
  declare abstract: string

  @column()
  declare posterUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare releasedAt: DateTime | null

  static released = scope((query) => {
    query.where(
      (
        group // use group to have a futur proof and
      ) =>
        group
          .where('statusId', MovieStatuses.RELEASED)
          .whereNotNull('releasedAt')
          .where('releasedAt', '<=', DateTime.now().toSQL())
    )
  })

  /*
  SELECT * FROM movies
  WHERE
    (
      statusId = 5
    AND releasedAt IS NOT NULL
    AND releasedAt < now()  
    )

  */
}
