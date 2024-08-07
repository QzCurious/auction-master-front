import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { ITEM_STATUS, ITEM_TYPE } from '../GetFrontendConfigs.data'

export interface Item {
  id: number
  consignorID: number
  nickname: string
  type: 0 | ITEM_TYPE['value']
  name: string
  description: string
  photos: Array<{
    sorted: number
    photo: string
    createdAt: string
    updatedAt: string
  }>
  pastStatuses: { [k in ITEM_STATUS['value']]?: string }
  directPurchasePrice: number
  minEstimatedPrice: number
  maxEstimatedPrice: number
  reservePrice: number
  expireAt: string
  warehouseID: string
  space: number
  grossWeight: number
  volumetricWeight: number
  status: ITEM_STATUS['value']
  createdAt: string
  updatedAt: string
}

interface Data extends Item {}

type ErrorCode = '1801'

export async function GetConsignorItem(id: number) {
  'use server'

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'GET',
    next: { tags: ['items'] },
  })

  return res
}
