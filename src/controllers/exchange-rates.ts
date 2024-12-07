import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { matchedData, validationResult } from 'express-validator'

// Initialize Prisma client once to avoid multiple instances
const prisma = new PrismaClient()

// Define types for request and response
interface RequestParams {}
interface ResponseBody {}
interface RequestBody {}
interface RequestQuery {
  from: string
  to: string
  amount: number // Changed from string to number for calculation
}

export const getExchangeRate = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
) => {
  // Validate request data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array({ onlyFirstError: true }),
    })
  }

  // Extract query parameters
  const { from, to, amount } = matchedData(req)

  try {
    // Fetch exchange rates from database
    const exchangeRates = await prisma.exchangeRates.findMany({
      where: {
        currencyCode: { in: [from, to] },
      },
    })

    const fromExchangeRate = exchangeRates.find((item) => item.currencyCode === from)
    const toExchangeRate = exchangeRates.find((item) => item.currencyCode === to)

    // Check for invalid or missing exchange rates
    if (!fromExchangeRate || !toExchangeRate) {
      return res.status(400).json({
        errors: 'Invalid or missing currency exchange rates',
      })
    }

    // Calculate the exchange rate
    const fromCurrencyToUsd = (1 / Number(fromExchangeRate.exchangeRate)) * amount
    const rate = fromCurrencyToUsd * Number(toExchangeRate.exchangeRate)

    // Respond with the calculated rate
    return res.json({
      data: {
        from,
        to,
        amount,
        rate,
      },
    })
  } catch (error) {
    // Handle unexpected errors
    console.error(error)
    return res.status(500).json({
      errors: 'An unexpected error occurred',
    })
  }
}
