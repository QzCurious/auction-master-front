'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

type Data = 'Success'

type ErrorCode = never

export async function ItemCompanyDirectPurchase(id: number) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/company-direct-purchase`,
    {
      method: 'POST',
    },
  )

  revalidateTag('items')

  return res
}
