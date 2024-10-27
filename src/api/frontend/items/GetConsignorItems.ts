'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { ITEM_STATUS, ITEM_TYPE } from '@/domain/static/static-config-mappers'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

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

export type StatusCounts = {
  [k in ITEM_STATUS['value']]?: number
}

interface Data {
  items: Array<Item>
  count: number
  statusCounts: StatusCounts
}

export async function GetConsignorItems(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/items?${query}`, {
      next: { tags: ['items'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
