import { QueryOptions } from '@tanstack/react-query'
import { Currency, getExchangeRate } from './getExchangeRate'

export const getExchangeRateQueryOptions = (from: Currency, to: Currency) =>
  ({
    queryKey: ['getExchangeRate', { from, to }],
    queryFn: () => getExchangeRate(from, to),
  }) satisfies QueryOptions
