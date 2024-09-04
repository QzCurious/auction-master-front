'use server'

import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  type: z.number().array().optional(),
  consignorID: z.number().optional(),
  status: z.number().array().optional(),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
})

export interface RecordSummary {
  totalJpyWithdrawal: number
  totalWithdrawal: number
  totalWithdrawalTransferFee: number
  totalClosedPrice: number
  totalPrice: number
  totalDirectPurchasePrice: number
  totalPurchasedPrice: number
  totalYahooAuctionFee: number
  totalCommission: number
  totalBonus: number
  totalProfit: number
  totalYahooCancellationFee: number
  totalSpaceFee: number
  totalShippingCost: number
}

export interface Reports {
  JPY?: RecordSummary
  TWD?: RecordSummary
}

type Data = Reports

type ErrorCode = never

const EMPTY_REPORT: RecordSummary = {
  totalJpyWithdrawal: 0,
  totalWithdrawal: 0,
  totalWithdrawalTransferFee: 0,
  totalClosedPrice: 0,
  totalPrice: 0,
  totalDirectPurchasePrice: 0,
  totalPurchasedPrice: 0,
  totalYahooAuctionFee: 0,
  totalCommission: 0,
  totalBonus: 0,
  totalProfit: 0,
  totalYahooCancellationFee: 0,
  totalSpaceFee: 0,
  totalShippingCost: 0,
}

export async function GetRecordsSummary(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  for (const type of data.type ?? []) {
    query.append('type', type.toString())
  }
  for (const status of data.status ?? []) {
    query.append('status', status.toString())
  }
  data.startAt && query.append('startAt', data.startAt.toISOString())
  data.endAt && query.append('endAt', data.endAt.toISOString())

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records/summary?${query}`,
    {
      method: 'GET',
      next: {
        tags: ['records'],
      },
    },
  )

  if (!res.error) {
    return {
      ...res,
      data: {
        JPY: res.data.JPY ?? EMPTY_REPORT,
        TWD: res.data.TWD ?? EMPTY_REPORT,
      },
    }
  }

  return res
}
