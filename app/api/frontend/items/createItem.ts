'use server'

import { revalidateTag } from 'next/cache'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { ITEM_TYPE_DATA } from '../configs.data'

type Data = 'Success'

type ErrorCode = never

export async function createItem(formData: FormData) {
  const name = formData.get('name')
  if (typeof name !== 'string' || name === '') {
    throw new Error('name is required and should be a string')
  }
  const type = formData.get('type')
  if (typeof type !== 'string' || Number.isNaN(parseInt(type))) {
    throw new Error('type should be a number')
  }
  if (type !== '0' && !ITEM_TYPE_DATA.find(({ value }) => value === parseInt(type))) {
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

  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/items', {
    method: 'POST',
    body: formData,
  })

  revalidateTag('items')

  return res
}
