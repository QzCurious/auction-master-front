'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { AuctionItem } from './GetConsignorAuctionItems'

type Data = 'Success'

export async function ConsignorPayAuctionItemFee(id: AuctionItem['auctionId']) {
  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>(`frontend/auction-items/${id}/payment/fee`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('auction-items')

  return res
}
