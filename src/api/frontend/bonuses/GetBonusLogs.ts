'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson, throwIfInvalid } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { BONUS_ACTION } from '@/domain/static/static-config-mappers'
import { z } from 'zod'

const ReqSchema = z.object({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface BonusLog {
  id: number
  consignorId: number
  opCode: string
  action: BONUS_ACTION['value']
  previousBalance: number
  netDifference: number
  createdAt: string
}

interface Data {
  bonusLogs: Array<BonusLog>
  count: number
}

export async function GetBonusLogs(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/bonuses/logs?${query}`, {
      next: { tags: ['bonuses'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
