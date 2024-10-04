'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { WALLET_ACTION } from '@/domain/static/static-config-mappers'

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

type ErrorCode = never

export async function GetWalletLogs(payload: z.input<typeof ReqSchema>) {
  const parsed = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, parsed)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/wallets/logs?${query}`,
    {
      method: 'GET',
      next: { tags: ['wallets'] },
    },
  )

  return res
}
