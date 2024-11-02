import MovieStatuses from '#enums/movie_statuses'
import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
  manyToMany,
  scope,
} from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import MovieStatus from './movie_status.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cineast from './cineast.js'
import Watchlist from './watchlist.js'

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

  @belongsTo(() => MovieStatus, {
    foreignKey: 'statusId',
  })
  declare status: BelongsTo<typeof MovieStatus>

  @belongsTo(() => Cineast, {
    foreignKey: 'directorId',
  })
  declare director: BelongsTo<typeof Cineast>

  @belongsTo(() => Cineast, {
    foreignKey: 'writerId',
  })
  declare writer: BelongsTo<typeof Cineast>

  @hasMany(() => Watchlist)
  declare watchlist: HasMany<typeof Watchlist>

  @manyToMany(() => Cineast, {
    pivotTable: 'crew_movies',
    pivotTimestamps: true,
    //localKey: 'id', // actual default lucid value, could be removed
    //relatedKey: 'id', // actual default lucid value, could be removed
    //pivotForeignKey: 'movie_id', // actual default lucid value, could be removed
    //pivotRelatedForeignKey: 'cineast_id', // actual default lucid value, could be removed
  })
  declare crewMembers: ManyToMany<typeof Cineast>

  @manyToMany(() => Cineast, {
    pivotTable: 'cast_movies',
    pivotColumns: ['character_name', 'sort_order'],
    pivotTimestamps: true,
  })
  declare castMembers: ManyToMany<typeof Cineast>

  @beforeCreate()
  static async slugify(movie: Movie) {
    if (movie.slug) {
      return
    }
    const slug = string.slug(movie.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('lower(??)=?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      movie.slug = slug
      return
    }

    const incrementors = rows.reduce<Number[]>((result, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)
      if (tokens.length < 2) {
        return result
      }

      const increment = Number(tokens.at(1))
      if (!Number.isNaN(increment)) {
        result.push(increment)
      }
      return result
    }, [])

    const increment = incrementors.length ? Math.max(...incrementors) + 1 : 1

    movie.slug = `${slug}-${increment}`
  }

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

  static notReleased = scope((query) => {
    query.where(
      (
        group // use group to have a futur proof and
      ) =>
        group
          .whereNot('statusId', MovieStatuses.RELEASED)
          .orWhereNull('releasedAt')
          .orWhere('releasedAt', '>', DateTime.now().toSQL())
    )
  })

  static comingSoon = scope((query) => {
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
