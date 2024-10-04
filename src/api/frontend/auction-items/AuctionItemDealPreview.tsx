'use server'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Item } from '../items/GetConsignorItem'
import { AuctionItem } from './GetConsignorAuctionItems'

interface Data {
  price: number
  yahooAuctionFee: number
  commission: number
  commissionBonus: number
  item: Item
  auctionItem: AuctionItem
}

type ErrorCode = never

export async function AuctionItemDealPreview(auctionId: AuctionItem['auctionId']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/auction-items/${auctionId}/deal/preview`,
    {
      method: 'GET',
      next: { tags: ['auction-items'] },
    },
  )

  return res
}
