'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

type Data = 'Success'

export async function ConsignorDeleteItemPhoto(id: number, sorted: number) {
  const res = await apiClientWithToken
    .delete<SuccessResponseJson<Data>>(`frontend/items/${id}/photos/${sorted}`)
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
