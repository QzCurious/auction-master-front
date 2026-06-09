'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

type Data = 'Success'

export async function UpdateConsignorAvatar(formData: FormData) {
  if (!formData.has('avatarPhoto')) {
    throw new Error('field avatarPhoto is required')
  }

  const res = await apiClientWithToken
    .patch<SuccessResponseJson<Data>>('frontend/consignor/avatar', {
      body: formData,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('consignor')

  return res
}
