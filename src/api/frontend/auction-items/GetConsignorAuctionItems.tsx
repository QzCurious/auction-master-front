'use server'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { AUCTION_ITEM_STATUS } from "@/domain/static/static-config-mappers"

const ReqSchema = z.object({
  status: z.coerce.number().array().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export interface AuctionItem {
  id: number
  consignorID: number
  itemID: number
  sellerID: number
  watcherID: number
  auctionID: string
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
  recordID: string
}

interface Data {
  auctionItems: Array<AuctionItem>
  count: number
}

type ErrorCode = never

export async function GetConsignorAuctionItems(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const query = new URLSearchParams()
  appendEntries(query, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/auction-items?${query}`,
    {
      method: 'GET',
      next: { tags: ['auction-items'] },
    },
  )

  return res
}
