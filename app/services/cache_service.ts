import redis from '@adonisjs/redis/services/main'

class InMemoryCacheService {
  #store: Record<string, any> = {}

  has(key: string) {
    return key in this.#store
  }

  get(key: string) {
    return this.#store[key]
  }

  set(key: string, value: any) {
    this.#store[key] = value
  }

  delete(key: string) {
    return delete this.#store[key]
  }
}

class RedisCacheService {
  async has(...keys: string[]) {
    return redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value && JSON.parse(value)
  }

  async set(key: string, value: any) {
    return redis.set(key, JSON.stringify(value))
  }

  async delete(...keys: string[]) {
    redis.del(keys)
  }

  async flushDB() {
    redis.flushdb()
  }
}

const cache = new RedisCacheService()
export default cache
