'use server'

import { AUCTION_ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { cache } from 'react'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

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

interface Data extends AuctionItem {}

type ErrorCode = never

async function GetConsignorAuctionItem(auctionId: AuctionItem['auctionId']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/auction-items/${auctionId}`,
    {
      method: 'GET',
      next: { tags: ['auction-items'] },
    },
  )

  return res
}

const CachedGetAuctionItem = cache(GetConsignorAuctionItem)

export { CachedGetAuctionItem as GetConsignorAuctionItem }
