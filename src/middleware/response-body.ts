import { NextFunction, Request, Response } from 'express'

// Middleware to capture the response body
export const responseBody = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send // Save the original send function

  // Override res.send to capture the response body
  res.send = function (body: any): Response {
    // Store the response body in a custom property
    res.locals.responseBody = body

    // Call the original send function to actually send the response
    return originalSend.call(this, body)
  }

  next()
}
