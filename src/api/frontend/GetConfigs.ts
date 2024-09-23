'use server'

import { apiClient } from '../apiClient'

export interface Configs {
  yahooAuctionFeeRate: number
  commissionRate: number
  defaultCommissionBonusRate: number
  auctionItemCancellationFee: number
  costPerSpace: number
  lineURL: string
  withdrawalTransferFee: number
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
  const res = await apiClient<Data, ErrorCode>('/configs', {
    method: 'GET',
    next: { tags: ['configs'] },
  })

  return res
}
