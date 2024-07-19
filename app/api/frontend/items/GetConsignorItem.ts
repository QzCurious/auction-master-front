import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { ITEM_STATUS_KEY_MAP, ITEM_TYPE_KEY_MAP } from '../GetFrontendConfigs.data'

export interface Item {
  id: number
  consignorID: number
  nickname: string
  type: keyof typeof ITEM_TYPE_KEY_MAP
  name: string
  description: string
  photos: Array<{
    sorted: number
    photo: string
    createdAt: string
    updatedAt: string
  }>
  pastStatuses: { [k in keyof typeof ITEM_STATUS_KEY_MAP]?: string }
  directPurchasePrice: number
  minEstimatedPrice: number
  maxEstimatedPrice: number
  reservePrice: number
  expireAt: string
  warehouseID: string
  space: number
  grossWeight: number
  volumetricWeight: number
  status: keyof typeof ITEM_STATUS_KEY_MAP
  createdAt: string
  updatedAt: string
}

interface Data extends Item {}

type ErrorCode = never

export async function GetConsignorItem(id: number) {
  'use server'

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'GET',
    next: { tags: ['items'] },
  })

  return res
}
