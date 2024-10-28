import MovieService from '#services/movie_service'
import vine from '@vinejs/vine'

export const movieFilterValidator = vine.compile(
  vine.object({
    search: vine
      .string() /*.alphaNumeric({ allowSpaces: true })*/
      .optional(),
    status: vine
      .number()
      .isExists({ table: 'movie_statuses', column: 'id', accept_all_if_zero: true })
      .optional(),
    sort: vine
      .string()
      .exists(async (_db, value) => {
        return MovieService.sortOptions.some((option) => option.id === value)
      })
      .optional(),
  })
)
