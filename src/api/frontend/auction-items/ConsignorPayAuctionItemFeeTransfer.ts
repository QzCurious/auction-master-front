'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { AuctionItem } from './GetConsignorAuctionItems'

type Data = string // report id

type ErrorCode = never

export async function ConsignorPayAuctionItemFeeTransfer(id: AuctionItem['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/auction-items/${id}/payment/fee-by-transfer`,
    {
      method: 'POST',
    },
  )

  revalidateTag('auction-items')

  return res
}
