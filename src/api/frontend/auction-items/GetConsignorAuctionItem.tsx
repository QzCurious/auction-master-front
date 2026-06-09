'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { AUCTION_ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { cache } from 'react'

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

async function GetConsignorAuctionItem(auctionId: AuctionItem['auctionId']) {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(`frontend/auction-items/${auctionId}`, {
      next: { tags: ['auction-items'] },
    })
    .json()
    .catch(createApiErrorServerSide)

  return res
}

const CachedGetAuctionItem = cache(GetConsignorAuctionItem)

export { CachedGetAuctionItem as GetConsignorAuctionItem }
