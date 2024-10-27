'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { AuctionItem } from './GetConsignorAuctionItems'

type Data = string // report id

export async function ConsignorPayAuctionItemFeeTransfer(
  id: AuctionItem['auctionId'],
) {
  const res = await apiClientWithToken
    .post<
      SuccessResponseJson<Data>
    >(`frontend/auction-items/${id}/payment/fee-by-transfer`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('auction-items')

  return res
}
