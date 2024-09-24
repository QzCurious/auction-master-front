'use server'

import { apiClient } from '@/api/apiClient'
import { throwIfInvalid } from '@/api/helpers/throwIfInvalid'
import { withAuth } from '@/api/withAuth'
import { appendEntries } from '@/domain/crud/appendEntries'
import {
  type RECORD_STATUS,
  type RECORD_TYPE,
} from '@/domain/static/static-config-mappers'
import { z } from 'zod'

const ReqSchema = z.object({
  type: z.number().array().optional(),
  status: z.number().array().optional(),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface Record {
  id: string
  type: RECORD_TYPE['value']
  opCode: string
  consignorID: number
  consignorNickname: string
  itemIDs?: number[]
  auctionItemIDs?: number[]
  shippingID?: string
  exchangeRate?: number
  jpyWithdrawal?: number
  withdrawal?: number
  withdrawalTransferFee?: number
  beneficiaryName?: string
  bankCode?: string
  bankAccount?: string
  closedPrice?: number
  price?: number
  directPurchasePrice?: number
  purchasedPrice?: number
  yahooAuctionFeeRate?: number
  yahooAuctionFeeJpy?: number
  yahooAuctionFee?: number
  commissionRate?: number
  commission?: number
  bonusRate?: number
  bonus?: number
  profit?: number
  shippingCostsWithinJapan?: number
  internationalShippingCosts?: number
  yahooCancellationFeeJpy?: number
  yahooCancellationFee?: number
  spaceFeeJpy?: number
  spaceFee?: number
  shippingCost?: number
  status: RECORD_STATUS['value']
  createdAt: string
  updatedAt: string
}

interface Data {
  records: Record[]
  count: number
}

type ErrorCode = never

export async function GetRecords(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records?${query}`,
    {
      method: 'GET',
      next: {
        tags: ['records'],
      },
    },
  )

  return res
}
