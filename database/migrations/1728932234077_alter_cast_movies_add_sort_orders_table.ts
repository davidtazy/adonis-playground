import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cast_movies'

  #col_name = 'sort_order'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer(this.#col_name).notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn(this.#col_name)
    })
  }
}
