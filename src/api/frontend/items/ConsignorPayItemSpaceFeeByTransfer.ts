'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { Record } from '../reports/GetRecords'
import { Item } from './GetConsignorItem'

type Data = Record['id']

export async function ConsignorPayItemSpaceFeeByTransfer(id: Item['id']) {
  const res = await apiClientWithToken
    .post<
      SuccessResponseJson<Data>
    >(`frontend/items/${id}/payment/space-fee-by-transfer`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
