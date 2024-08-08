'use server'

import { apiClient } from '../apiClient'
import { withAuth } from '../withAuth'
import { GetFrontendConfigs_DATA } from './GetFrontendConfigs.data'

export interface Configs {
  yahooAuctionFeeRate: number
  commissionRate: number
  commissionBonusRate: number
  auctionItemCancellationFee: number
  costPerSpace: number
  lineURL: string
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
  itemType: Array<{
    key: (typeof GetFrontendConfigs_DATA.itemType)[number]['key']
    message: string
    value: number
  }>
  itemStatus: Array<{
    key: (typeof GetFrontendConfigs_DATA.itemStatus)[number]['key']
    message: string
    value: number
  }>
  auctionItemStatus: Array<{
    key: (typeof GetFrontendConfigs_DATA.auctionItemStatus)[number]['key']
    message: string
    value: number
  }>
  consignorStatus: Array<{
    key: (typeof GetFrontendConfigs_DATA.consignorStatus)[number]['key']
    message: string
    value: number
  }>
  consignorVerificationStatus: Array<{
    key: (typeof GetFrontendConfigs_DATA.consignorVerificationStatus)[number]['key']
    message: string
    value: number
  }>
  shippingType: Array<{
    key: (typeof GetFrontendConfigs_DATA.shippingType)[number]['key']
    message: string
    value: number
  }>
  shippingStatus: Array<{
    key: (typeof GetFrontendConfigs_DATA.shippingStatus)[number]['key']
    message: string
    value: number
  }>
}

interface Data extends Configs {}

type ErrorCode = never

export async function GetFrontendConfigs() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/configs', {
    method: 'GET',
    next: { tags: ['configs'] },
  })

  return res
}
