'use server'

import { z } from 'zod'

import { appendEntries } from '@/domain/crud/appendEntries'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { RECORD_TYPE, type RECORD_STATUS } from "@/domain/static/static-config-mappers"

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
  consignorID: number
  consignorNickname: string
  opCode: string
  itemID?: number
  auctionItemID?: number
  exchangeRate?: number
  jpyWithdrawal?: number
  withdrawal?: number
  withdrawalTransferFee?: number
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
