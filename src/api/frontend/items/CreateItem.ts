'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { ITEM_TYPE } from '@/domain/static/static-config-mappers'
import { revalidateTag } from 'next/cache'

type Data = 'Success'

export async function CreateItem(formData: FormData) {
  const name = formData.get('name')
  if (typeof name !== 'string' || name === '') {
    throw new Error('name is required and should be a string')
  }
  const type = formData.get('type')
  if (typeof type !== 'string' || Number.isNaN(parseInt(type))) {
    throw new Error('type should be a number')
  }
  const isNew = formData.get('isNew')
  if (isNew !== 'true' && isNew !== 'false') {
    throw new Error('isNew should be a boolean')
  }
  if (type !== '0' && !ITEM_TYPE.data.find(({ value }) => value === parseInt(type))) {
    throw new Error('type is invalid')
  }
  const reservePrice = formData.get('reservePrice')
  if (typeof reservePrice !== 'string' || Number.isNaN(parseInt(reservePrice))) {
    throw new Error('reservePrice should be a number')
  }
  if (formData.getAll('photo').length === 0) {
    throw new Error('photo is required and should be an array of files')
  }
  if (formData.getAll('sorted').length !== formData.getAll('photo').length) {
    throw new Error('photo and sorted should have the same length')
  }

  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>('frontend/items', {
      body: formData,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
