import express, { Express, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { responseBody } from './middleware/response-body'
import { authenticateToken } from './middleware/authenticate-token'
import rateLimiter from './middleware/rate-limiter'

dotenv.config()

const app: Express = express()

// Define a custom morgan token to log response body
morgan.token('response-body', (req: Request, res: Response) => {
  return res.locals.responseBody || '' // If there's a body, log it; otherwise, log nothing
})

// Create a log file in append mode
const logFilePath = process.env.LOG_FILE_PATH ?? path.join(__dirname, 'access.log')
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' })

app.use(responseBody)
app.use(morgan(':date[iso] :method :url :status :response-time ms - :response-body', { stream: accessLogStream }))
app.use(express.json())
app.use(authenticateToken)
app.use(rateLimiter)

app.use('/v1/exchange-rates', routes)

export default app
