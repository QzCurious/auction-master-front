'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { Currency } from '@/domain/static/static'
import {
  type RECORD_STATUS,
  type RECORD_TYPE,
} from '@/domain/static/static-config-mappers'

export interface Record {
  id: string
  type: RECORD_TYPE['value']
  consignorId: number
  consignorNickname: string
  opCode: string
  itemId?: number
  auctionId?: number
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

export async function GetRecord(id: Record['id']) {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/reports/records/${id}`, {
      next: {
        tags: ['records'],
      },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
