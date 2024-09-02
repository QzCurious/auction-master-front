'use server'

import { Currency } from '@/app/static'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { type RECORD_STATUS, type RECORD_TYPE } from '../static-configs.data'

export interface Record {
  id: string
  type: RECORD_TYPE['value']
  consignorID: number
  consignorNickname: string
  opCode: string
  itemID?: number
  auctionItemID?: number
  currency: Currency
  exchangeRate?: number
  jpyWithdrawal?: number
  withdrawal?: number
  closedPrice?: number
  price?: number
  directPurchasePrice?: number
  purchasedPrice?: number
  yahooAuctionFeeRate?: number
  yahooAuctionFee?: number
  commissionRate?: number
  commission?: number
  bonusRate?: number
  bonus?: number
  profit?: number
  yahooCancellationFee?: number
  spaceFee?: number
  shippingCost?: number
  status: RECORD_STATUS['value']
  createdAt: string
  updatedAt: string
}

type Data = Record

type ErrorCode = never

export async function GetRecord(id: Record['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records/${id}`,
    {
      method: 'GET',
      next: {
        tags: ['records'],
      },
    },
  )

  return res
}
