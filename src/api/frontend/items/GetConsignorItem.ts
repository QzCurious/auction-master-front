'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { ITEM_STATUS, ITEM_TYPE } from "@/domain/static/static-config-mappers"

export interface Item {
  id: number
  consignorId: number
  type: 0 | ITEM_TYPE['value']
  isNew: boolean
  name: string
  description: string
  directPurchasePrice: number
  minEstimatedPrice: number
  maxEstimatedPrice: number
  reservePrice: number
  expireAt: string | null
  warehouseId: string
  space: number
  shippingCostsWithinJapan: number
  grossWeight: number
  volumetricWeight: number
  status: ITEM_STATUS['value']
  createdAt: string
  updatedAt: string
  nickname: string
  photos: Array<{
    sorted: number
    photo: string
    createdAt: string
    updatedAt: string
  }>
  pastStatuses?: { [k in ITEM_STATUS['value']]?: string }
  auctionId?: number
  recordId?: string
}

interface Data extends Item {}

type ErrorCode = '1801'

export async function GetConsignorItem(id: number) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'GET',
    next: { tags: ['items'] },
  })

  return res
}
