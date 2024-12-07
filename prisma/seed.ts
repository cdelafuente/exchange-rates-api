import { PrismaClient } from '@prisma/client'
import exchangeRateData from './exchange-rates.json'

const prisma = new PrismaClient()

interface Rates {
  [key: string]: string
}

interface CurrencyData {
  currency: string
  rates: Rates
}

interface ExchangeRatesResponse {
  data: CurrencyData
}

const main = async () => {
  const response = exchangeRateData as ExchangeRatesResponse
  for (const entry of Object.entries(response.data.rates)) {
    const [currencyCode, exchangeRate] = entry
    const row = await prisma.exchangeRates.create({
      data: {
        currencyCode,
        exchangeRate: Number(exchangeRate),
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
