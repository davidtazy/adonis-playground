import vine from '@vinejs/vine'

export const fullNameRule = vine.string().maxLength(100).optional()

export const registerValidator = vine.compile(
  vine.object({
    fullName: fullNameRule,
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
