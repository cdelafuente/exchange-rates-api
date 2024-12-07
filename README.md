# Exchange Rates API

## About
This API provides an endpoint for getting the exchange rate between fiat currencies and some crypto currencies:
```
  BTC = 'Bitcoin',
  ETH = 'Ethereum',
  LTC = 'Litecoin',
  BCH = 'Bitcoin Cash',
  ETC = 'Ethereum Classic',
  ZRX = '0x Protocol',
  USDC = 'USDC',
  BAT = 'Basic Attention Token',
  ZEC = 'Zcash',
  XRP = 'XRP',
  XLM = 'Stellar Lumens',
  REP = 'Augur',
  DAI = 'Dai',
  EOS = 'EOS',
  LINK = 'Chainlink',
  XTZ = 'Tezos',
  DASH = 'Dash',
  OXT = 'Orchid',
  ATOM = 'Cosmos',
  KNC = 'Kyber Network',
  MKR = 'Maker',
  COMP = 'Compound',
  ALGO = 'Algorand',
  BAND = 'Band Protocol',
  NMR = 'Numeraire',
  CGLD = 'Celo',
  UMA = 'UMA',
  LRC = 'Loopring',
  YFI = 'yearn.finance',
  UNI = 'Uniswap',
  BAL = 'Balancer',
  WBTC = 'Wrapped Bitcoin',
  CVC = 'Civic',
  MANA = 'Decentraland',
  DNT = 'district0x',
  FIL = 'Filecoin',
  AAVE = 'Aave',
  BNT = 'Bancor Network Token',
  SNX = 'Synthetix Network Token',
  GRT = 'The Graph',
  SUSHI = 'SushiSwap',
  MATIC = 'Polygon'
```

### Architecture
This API was built with:

* Redis for rate limiting
* PosgreSQL
* Express.js
* Prisma
* TypeScript
* Node.js

### Features
* This API rate limits requests according to the following criteria:
    * Weekday: 100 requests per day
    * Weekend: 200 requests per day
* It provides headers with rate limit information for each request:
```
< RateLimit-Policy: 100;w=29556
< RateLimit-Limit: 100
< RateLimit-Remaining: 88
< RateLimit-Reset: 29560
```
* All requests should be authenticated with a bearer token.
* All responses are returned in JSON format.

## Getting Started

Install dependencies
```bash
npm install
```

Copy the example env file
```bash
cp .env.example .env
```

Start services
```bash
docker compose up -d
```

Set up the database 
```bash
npx prisma migrate dev
npx prisma db seed
```

Start the app
```bash
npm run dev
```

## Tests
This project uses SuperTest. To run the tests use:
```bash
npm run test
```

## Examples

To convert MXN dollars to JPY:
```bash
curl -H "Authorization: Bearer bab458d6-8352-42e6-88a1-88acc76b4e43" -v http://localhost:8080/v1/exchange-rates/convert\?from\=MXN\&to\=JPY\&amount\=1
```

Response:
```json
{
    "data":
        {
            "from": "MXN",
            "to": "JPY",
            "amount": "1",
            "rate": 7.423143288198385
        }
}
```

Returns an invalid request error if an invalid currency symbol was used:

```bash
curl -H "Authorization: Bearer bab458d6-8352-42e6-88a1-88acc76b4e43" -v http://localhost:8080/v1/exchange-rates/convert\?from\=ZZZ\&to\=JPY\&amount\=1
```

Response:
```json
{
    "errors": [
        {
            "type": "field",
            "value": "ZZZ",
            "msg": "to must be a valid currency",
            "path": "from",
            "location": "query"
        }
    ]
}
```

Returns 401 error if the bearer token was not provided:

```bash
curl -v http://localhost:8080/v1/exchange-rates/convert\?from\=MXN\&to\=JPY\&amount\=1
```

Response:
```json
{
    "error": "Missing token"
}
```

