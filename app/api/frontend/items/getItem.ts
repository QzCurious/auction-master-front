'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { ITEM_STATUS_DATA } from '../configs.data'

export interface Item {
  id: number
  consignorID: number
  type: number
  name: string
  description: string
  photos: Array<{
    sorted: number
    photo: string
  }>
  space: number
  minEstimatedPrice: number
  maxEstimatedPrice: number
  sellerID: number
  reservePrice: number
  expireAt: any
  status: (typeof ITEM_STATUS_DATA)[number]['value']
  createdAt: string
  updatedAt: string
}

interface Data extends Item {}

/**
 * 1801: item not exist
 */
type ErrorCode = '1801'

export async function getItem(id: number) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'GET',
    next: { tags: ['items'] },
  })

  return res
}
