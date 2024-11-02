import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { VineNumber } from '@vinejs/vine'

type ExistsOptions = {
  table: string
  column: string
  accept_all_if_zero: true | undefined
}

async function isExists(value: unknown, options: ExistsOptions, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }

  if (options.accept_all_if_zero === true) {
    if (value === 0) {
      return
    }
  }

  const result = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (!result) {
    //report that the value is not unique
    field.report(`Value for ${field.name} does not exists`, 'isExists', field)
  }
}

export const isUniqueRule = vine.createRule(isExists)

declare module '@vinejs/vine' {
  interface VineNumber {
    isExists(options: Options): this
  }
}

VineNumber.macro('isExists', function (this: VineNumber, options: Options) {
  return this.use(isUniqueRule(options))
})
