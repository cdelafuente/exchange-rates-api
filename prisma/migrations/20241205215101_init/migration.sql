-- CreateTable
CREATE TABLE "ExchangeRates" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyCode" VARCHAR(16) NOT NULL,
    "exchangeRate" DECIMAL(15,6) NOT NULL,

    CONSTRAINT "ExchangeRates_pkey" PRIMARY KEY ("id")
);
