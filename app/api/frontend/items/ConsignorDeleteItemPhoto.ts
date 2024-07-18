'use server'

import { revalidateTag } from 'next/cache'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = 'Success'

type ErrorCode = never

export async function ConsignorDeleteItemPhoto(id: number, sorted: number) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/photos/${sorted}`,
    {
      method: 'DELETE',
    },
  )

  revalidateTag('items')

  return res
}
