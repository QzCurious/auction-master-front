import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { BONUS_ACTION } from '../static-configs.data'

const ReqSchema = z.object({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  status: z.coerce.number().array().optional(),
  sort: z.string().optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface BonusLog {
  id: number
  consignorID: number
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

type ErrorCode = never

export async function GetBonusLogs(payload: z.input<typeof ReqSchema>) {
  'use server'
  const parsed = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()

  parsed.startAt != null && query.append('startAt', parsed.startAt.toISOString())
  parsed.endAt != null && query.append('endAt', parsed.endAt.toISOString())
  for (const status of parsed.status ?? []) {
    query.append('status', status.toString())
  }
  parsed.sort != null && query.append('sort', parsed.sort)
  parsed.order != null && query.append('order', parsed.order)
  parsed.limit != null && query.append('limit', parsed.limit.toString())
  parsed.offset != null && query.append('offset', parsed.offset.toString())

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/bonuses/logs?${query}`,
    {
      method: 'GET',
      next: { tags: ['bonuses'] },
    },
  )

  return res
}
