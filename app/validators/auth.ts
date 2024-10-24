import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(100).optional(),
    email: vine.string().email().normalizeEmail().isUnique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(100),
    //userId: vine.number().isUnique({ table: 'users', column: 'id' }), just to demonstrate the custom number validator
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
    isRememberMe: vine.accepted().optional(),
  })
)
