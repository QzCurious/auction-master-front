'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { WALLET_ACTION } from '@/domain/static/static-config-mappers'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface WalletLog {
  id: number
  consignorId: number
  opCode: string
  action: WALLET_ACTION['value']
  previousBalance: number
  netDifference: number
  createdAt: string
}

interface Data {
  walletLogs: Array<WalletLog>
  count: number
}

export async function GetWalletLogs(payload: z.input<typeof ReqSchema>) {
  const parsed = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, parsed)

  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/wallets/logs?${query}`, {
      next: { tags: ['wallets'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
