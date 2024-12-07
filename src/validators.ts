import { query } from 'express-validator'
import { CURRENCIES } from './controllers/types'

export const currencyValidator = (field: string) => {
  return query(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .trim()
    .isIn(Object.keys(CURRENCIES))
    .withMessage(`${field} must be a valid currency`)
}

export const amountValidator = query('amount')
  .notEmpty()
  .withMessage('Amount is required')
  .trim()
  .isNumeric()
  .withMessage('Amount must be a number')
