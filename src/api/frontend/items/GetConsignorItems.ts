'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { ITEM_STATUS, ITEM_TYPE } from "@/domain/static/static-config-mappers"

const ReqSchema = z.object({
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface Item {
  id: number
  consignorID: number
  type: 0 | ITEM_TYPE['value']
  isNew: boolean
  name: string
  description: string
  directPurchasePrice: number
  minEstimatedPrice: number
  maxEstimatedPrice: number
  reservePrice: number
  expireAt: string | null
  warehouseID: string
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
  auctionItemID?: number
  recordID?: string
}

export type StatusCounts = {
  [k in ITEM_STATUS['value']]?: number
}

interface Data {
  items: Array<Item>
  count: number
  statusCounts: StatusCounts
}

type ErrorCode = never

export async function GetConsignorItems(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items?${query}`, {
    method: 'GET',
    next: { tags: ['items'] },
  })

  return res
}
