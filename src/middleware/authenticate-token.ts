import { NextFunction, Request, Response } from 'express'

// Middleware for verifying user id is being sent as auth bearer token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Missing token' })
  }

  res.locals.userId = token

  next()
}
