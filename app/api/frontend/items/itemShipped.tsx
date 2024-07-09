'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = 'Success'

type ErrorCode = never

export async function itemShipped(id: number) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/shipped`,
    {
      method: 'POST',
    },
  )

  revalidateTag('items')

  return res
}
