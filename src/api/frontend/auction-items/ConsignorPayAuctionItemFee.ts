'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { AuctionItem } from './GetConsignorAuctionItems'

type Data = 'Success'

type ErrorCode =
  // 大師幣不足
  '1703'

export async function ConsignorPayAuctionItemFee(id: AuctionItem['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/auction-items/${id}/payment/fee`,
    {
      method: 'POST',
    },
  )

  revalidateTag('auction-items')

  return res
}