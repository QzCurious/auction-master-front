import { QueryOptions } from '@tanstack/react-query'
import { GetConsignorWalletBalance } from './GetConsignorWalletBalance'

export const GetConsignorWalletBalanceQueryOptions = {
  queryKey: ['wallets'],
  queryFn: () => GetConsignorWalletBalance(),
} satisfies QueryOptions
