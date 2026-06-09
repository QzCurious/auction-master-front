'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

type Data = 'Success'

export async function ItemChoosesCompanyDirectPurchase(id: number) {
  const res = await apiClientWithToken
    .post<
      SuccessResponseJson<Data>
    >(`frontend/items/${id}/choose-company-direct-purchase`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
