'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson, throwIfInvalid } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { AUCTION_ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { z } from 'zod'

const ReqSchema = z.object({
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface AuctionItem {
  auctionId: string
  consignorId: number
  itemId: number
  sellerId: number
  watcherId: number
  name: string
  photo: string
  reservePrice: number
  currentPrice: number
  highestPrice: number
  closeAt: string
  closedPrice: number
  status: AUCTION_ITEM_STATUS['value']
  createdAt: string
  updatedAt: string
  consignorNickname: string
  sellerName: string
  watcherName: string
  bidders: Array<{
    account: string
    rating: number
    bidAmount: number
    quantity: number
    lastBidAt: string
  }>
  recordId: string
}

interface Data {
  auctionItems: Array<AuctionItem>
  count: number
}

export async function GetConsignorAuctionItems(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/auction-items?${query}`, {
      next: { tags: ['auction-items'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}
