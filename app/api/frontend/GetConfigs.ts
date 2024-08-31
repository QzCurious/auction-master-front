'use server'

import { apiClient } from '../apiClient'
import { withAuth } from '../withAuth'

export interface Configs {
  yahooAuctionFeeRate: number
  commissionRate: number
  defaultCommissionBonusRate: number
  auctionItemCancellationFee: number
  costPerSpace: number
  lineURL: string
  bankName: string
  bankCode: string
  bankAccount: string
  shippingInfo: {
    company: {
      address: string
      recipientName: string
      phone: string
    }
    sevenEleven: {
      storeNumber: string
      storeName: string
      recipientName: string
      phone: string
    }
    family: {
      storeNumber: string
      storeName: string
      recipientName: string
      phone: string
    }
  }
}

interface Data extends Configs {}

type ErrorCode = never

export async function GetConfigs() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/configs', {
    method: 'GET',
    next: { tags: ['configs'] },
  })

  return res
}
