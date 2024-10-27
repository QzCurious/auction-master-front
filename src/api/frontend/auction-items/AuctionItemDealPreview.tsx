'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
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

export async function AuctionItemDealPreview(auctionId: AuctionItem['auctionId']) {
  const res = await apiClientWithToken
    .get<SuccessResponseJson<Data>>(
      `frontend/auction-items/${auctionId}/deal/preview`,
      {
        next: { tags: ['auction-items'] },
      },
    )
    .json()
    .catch(createApiErrorServerSide)

  return res
}
