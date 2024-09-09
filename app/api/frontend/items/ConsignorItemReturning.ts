'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Item } from './GetConsignorItem'

type Data = 'Success'

type ErrorCode = never

export async function ConsignorItemReturning(id: Item['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/returning`,
    {
      method: 'POST',
    },
  )

  revalidateTag('items')

  return res
}
