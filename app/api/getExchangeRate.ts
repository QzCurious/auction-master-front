'use server'

import { parse } from 'csv-parse/sync'
import { LRUCache } from 'lru-cache'
import { z } from 'zod'
import { combinations } from '../static'

const currencies = [
  'NTD',
  'USD',
  'HKD',
  'GBP',
  'AUD',
  'CAD',
  'SGD',
  'CHF',
  'JPY',
  'ZAR',
  'SEK',
  'NZD',
  'THB',
  'PHP',
  'IDR',
  'EUR',
  'KRW',
  'VND',
  'MYR',
  'CNY',
] as const

type Currency = (typeof currencies)[number]

export async function getExchangeRate(from: Currency, to: Currency) {
  const rate = await cache.fetch(`${from}-${to}`)
  return rate!
}

const cache = new LRUCache<`${Currency}-${Currency}`, number>({
  max: combinations(currencies.length, 2),
  ttl: 1000 * 60 * 60, // 1 hour
  allowStale: true,
  fetchMethod: async (key) => {
    const [from, to] = key.split('-') as [Currency, Currency]
    return _exchangeRate(from, to)
  },
})

const schema = z.array(
  z.object({
    Currency: z.enum(currencies),
    Rate: z.tuple([z.literal('Buying'), z.literal('Selling')]),
    Cash: z.tuple([z.coerce.number(), z.coerce.number()]),
    Spot: z.tuple([z.coerce.number(), z.coerce.number()]),
  }),
)

async function _exchangeRate(from: Currency, to: Currency) {
  console.log('Updating exchange rate', from, to)
  const res = await fetch('https://rate.bot.com.tw/xrt/flcsv/0/day', {
    headers: { 'Accept-Language': 'en-US' },
  })
  const text = await res.text()
  const data = parse(text, {
    from_line: 1,
    columns: true,
    ignore_last_delimiters: true,
    group_columns_by_name: true,
  })

  const parsed = schema.parse(data)

  const fromExchange =
    from === 'NTD' ? 1 : parsed.find((d) => d.Currency === from)?.Spot[0]
  const toExchange = to === 'NTD' ? 1 : parsed.find((d) => d.Currency === to)?.Spot[0]
  if (!toExchange || !fromExchange) {
    throw new Error(`Invalid args: to: ${to}, from: ${from}`)
  }

  return fromExchange / toExchange
}

const s =
  '幣別,匯率,現金,即期,遠期10天,遠期30天,遠期60天,遠期90天,遠期120天,遠期150天,遠期180天,匯率,現金,即期,遠期10天,遠期30天,遠期60天,遠期90天,遠期120天,遠期150天,遠期180天\r\n' +
  'USD,本行買入,32.20500,32.53000,32.52700,32.43800,32.32100,32.21500,32.10000,32.00000,31.90000,本行賣出,32.87500,32.68000,32.63300,32.55100,32.44700,32.35000,32.25000,32.16500,32.06700,\r\n' +
  'HKD,本行買入,4.02100,4.14200,4.14200,4.13500,4.12400,4.11400,4.10200,4.09100,4.07900,本行賣出,4.22500,4.21200,4.20300,4.19800,4.18700,4.17700,4.16700,4.15600,4.14600,\r\n' +
  'GBP,本行買入,41.16000,42.05500,42.15100,42.05300,41.92300,41.80100,41.66800,41.53500,41.40200,本行賣出,43.28000,42.68500,42.56200,42.48500,42.35400,42.23700,42.12600,42.01500,41.90400,\r\n' +
  'AUD,本行買入,21.57000,21.78500,21.84700,21.80100,21.74400,21.69200,21.63800,21.58400,21.53000,本行賣出,22.35000,22.13000,22.05700,22.03200,21.97500,21.92100,21.86100,21.80000,21.73800,\r\n' +
  'CAD,本行買入,23.36000,23.69000,23.72500,23.67500,23.61100,23.55300,23.49000,23.42800,23.36500,本行賣出,24.27000,24.02000,23.93300,23.89900,23.83400,23.77700,23.72200,23.66800,23.61400,\r\n' +
  'SGD,本行買入,23.74000,24.21000,24.22000,24.17900,24.13200,24.08800,24.04200,23.99600,23.95000,本行賣出,24.65000,24.43000,24.41000,24.39000,24.34200,24.30000,24.26100,24.22200,24.18300,\r\n' +
  'CHF,本行買入,36.10000,36.71000,36.74700,36.74000,36.74900,36.76100,36.77000,36.77800,36.78600,本行賣出,37.30000,37.10000,37.01200,37.03600,37.05100,37.06200,37.08900,37.11600,37.14300,\r\n' +
  'JPY,本行買入,0.19920,0.20600,0.20680,0.20690,0.20710,0.20730,0.20750,0.20770,0.20790,本行賣出,0.21200,0.21100,0.21080,0.21110,0.21140,0.21160,0.21200,0.21230,0.21270,\r\n' +
  'ZAR,本行買入,0.00000,1.74300,1.75100,1.74400,1.73300,1.72400,1.71400,1.70400,1.69400,本行賣出,0.00000,1.83300,1.83200,1.82600,1.81600,1.80700,1.79700,1.78800,1.77800,\r\n' +
  'SEK,本行買入,2.71000,3.04000,3.03800,3.03300,3.02700,3.02200,3.01700,3.01200,3.00700,本行賣出,3.23000,3.16000,3.13900,3.13600,3.13100,3.12600,3.12200,3.11800,3.11500,\r\n' +
  'NZD,本行買入,19.32000,19.65000,19.68300,19.63000,19.56200,19.49900,19.43100,19.36400,19.29600,本行賣出,20.17000,19.95000,19.89200,19.85700,19.78900,19.72800,19.66700,19.60600,19.54500,\r\n' +
  'THB,本行買入,0.77830,0.88870,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,0.96830,0.93470,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'PHP,本行買入,0.49350,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,0.62550,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'IDR,本行買入,0.00168,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,0.00238,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'EUR,本行買入,34.83000,35.34500,35.42500,35.37400,35.29400,35.23100,35.16800,35.10400,34.99800,本行賣出,36.17000,35.94500,35.83000,35.79000,35.72000,35.67900,35.63100,35.58200,35.53300,\r\n' +
  'KRW,本行買入,0.02184,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,0.02574,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'VND,本行買入,0.00104,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,0.00145,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'MYR,本行買入,5.96000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,本行賣出,7.48500,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'CNY,本行買入,4.38700,4.45400,4.45690,4.45070,4.44410,4.43720,4.43180,4.42400,4.42090,本行賣出,4.54900,4.51400,4.50820,4.50470,4.49960,4.49320,4.49080,4.48830,4.48590,\r\n' +
  ''

const ss =
  'Currency,Rate,Cash,Spot,Forward-10Days,Forward-30Days,Forward-60Days,Forward-90Days,Forward-120Days,Forward-150Days,Forward-180Days,Rate,Cash,Spot,Forward-10Days,Forward-30Days,Forward-60Days,Forward-90Days,Forward-120Days,Forward-150Days,Forward-180Days\r\n' +
  'USD,Buying,32.20500,32.53000,32.52700,32.43800,32.32100,32.21500,32.10000,32.00000,31.90000,Selling,32.87500,32.68000,32.63300,32.55100,32.44700,32.35000,32.25000,32.16500,32.06700,\r\n' +
  'HKD,Buying,4.02100,4.14200,4.14200,4.13500,4.12400,4.11400,4.10200,4.09100,4.07900,Selling,4.22500,4.21200,4.20300,4.19800,4.18700,4.17700,4.16700,4.15600,4.14600,\r\n' +
  'GBP,Buying,41.16000,42.05500,42.15100,42.05300,41.92300,41.80100,41.66800,41.53500,41.40200,Selling,43.28000,42.68500,42.56200,42.48500,42.35400,42.23700,42.12600,42.01500,41.90400,\r\n' +
  'AUD,Buying,21.57000,21.78500,21.84700,21.80100,21.74400,21.69200,21.63800,21.58400,21.53000,Selling,22.35000,22.13000,22.05700,22.03200,21.97500,21.92100,21.86100,21.80000,21.73800,\r\n' +
  'CAD,Buying,23.36000,23.69000,23.72500,23.67500,23.61100,23.55300,23.49000,23.42800,23.36500,Selling,24.27000,24.02000,23.93300,23.89900,23.83400,23.77700,23.72200,23.66800,23.61400,\r\n' +
  'SGD,Buying,23.74000,24.21000,24.22000,24.17900,24.13200,24.08800,24.04200,23.99600,23.95000,Selling,24.65000,24.43000,24.41000,24.39000,24.34200,24.30000,24.26100,24.22200,24.18300,\r\n' +
  'CHF,Buying,36.10000,36.71000,36.74700,36.74000,36.74900,36.76100,36.77000,36.77800,36.78600,Selling,37.30000,37.10000,37.01200,37.03600,37.05100,37.06200,37.08900,37.11600,37.14300,\r\n' +
  'JPY,Buying,0.19920,0.20600,0.20680,0.20690,0.20710,0.20730,0.20750,0.20770,0.20790,Selling,0.21200,0.21100,0.21080,0.21110,0.21140,0.21160,0.21200,0.21230,0.21270,\r\n' +
  'ZAR,Buying,0.00000,1.74300,1.75100,1.74400,1.73300,1.72400,1.71400,1.70400,1.69400,Selling,0.00000,1.83300,1.83200,1.82600,1.81600,1.80700,1.79700,1.78800,1.77800,\r\n' +
  'SEK,Buying,2.71000,3.04000,3.03800,3.03300,3.02700,3.02200,3.01700,3.01200,3.00700,Selling,3.23000,3.16000,3.13900,3.13600,3.13100,3.12600,3.12200,3.11800,3.11500,\r\n' +
  'NZD,Buying,19.32000,19.65000,19.68300,19.63000,19.56200,19.49900,19.43100,19.36400,19.29600,Selling,20.17000,19.95000,19.89200,19.85700,19.78900,19.72800,19.66700,19.60600,19.54500,\r\n' +
  'THB,Buying,0.77830,0.88870,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,0.96830,0.93470,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'PHP,Buying,0.49350,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,0.62550,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'IDR,Buying,0.00168,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,0.00238,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'EUR,Buying,34.83000,35.34500,35.42500,35.37400,35.29400,35.23100,35.16800,35.10400,34.99800,Selling,36.17000,35.94500,35.83000,35.79000,35.72000,35.67900,35.63100,35.58200,35.53300,\r\n' +
  'KRW,Buying,0.02184,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,0.02574,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'VND,Buying,0.00104,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,0.00145,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'MYR,Buying,5.96000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,Selling,7.48500,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,0.00000,\r\n' +
  'CNY,Buying,4.38700,4.45400,4.45690,4.45070,4.44410,4.43720,4.43180,4.42400,4.42090,Selling,4.54900,4.51400,4.50820,4.50470,4.49960,4.49320,4.49080,4.48830,4.48590,\r\n' +
  ''