'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { Item } from './GetConsignorItem'

type Data = 'Success'

export async function ConsignorPayItemSpaceFee(id: Item['id']) {
  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>(`frontend/items/${id}/payment/space-fee`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
