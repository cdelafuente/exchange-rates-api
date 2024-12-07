import { Router } from 'express'
import { getExchangeRate } from './controllers/exchange-rates'
import { amountValidator, currencyValidator } from './validators'

// Router instance
const router = Router()

// Define the route with validation middleware
router.get('/convert', [currencyValidator('from'), currencyValidator('to'), amountValidator], getExchangeRate)

export default router
