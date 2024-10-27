'use server'

import { apiClientBase } from '../core/apiClientBase'
import { createApiErrorServerSide } from '../core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '../core/static'

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

export async function GetConfigs() {
  const res = await apiClientBase
    .get<SuccessResponseJson<Data>>('configs', {
      next: { tags: ['configs'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
