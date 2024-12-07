import { getMsUntilEndOfDay, isWorkday } from '../utils'
import { createClient, RedisClientType } from 'redis'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { Request, Response } from 'express'

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || 6379

let redisClient: RedisClientType | null = null

const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    redisClient = createClient({ url: `redis://${redisHost}:${redisPort}` })
    redisClient.on('error', (err) => console.error('Redis client error', err))
    redisClient.connect().catch((err) => console.error('Redis Connection Error', err))
  }
  return redisClient
}

const maxReqWorkday = Number(process.env.MAX_REQ_WORKDAY ?? 100)
const maxReqWeekend = Number(process.env.MAX_REQ_WEEKEND ?? 200)

const windowMs = getMsUntilEndOfDay()
const max = isWorkday() ? maxReqWorkday : maxReqWeekend

const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => getRedisClient().sendCommand(args),
  }),
  keyGenerator: (req: Request, res: Response): string => {
    // Return the token value that was validated in the authenticate token middleware
    return res.locals.userId
  },
})

export default rateLimiter
