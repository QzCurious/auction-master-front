'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

type Data = 'Success'

export async function ConsignorUpsertItemPhoto(id: number, formData: FormData) {
  if (formData.getAll('photo').length === 0) {
    throw new Error('photo is required and should be an array of files')
  }
  if (formData.getAll('sorted').length !== formData.getAll('photo').length) {
    throw new Error('photo and sorted should have the same length')
  }

  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>(`frontend/items/${id}/photos`, {
      body: formData,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
