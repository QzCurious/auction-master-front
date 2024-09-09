'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Item } from './GetConsignorItem'

type Data = 'Success'

type ErrorCode =
  // 大師幣不足
  '1703'

export async function ConsignorPayItemSpaceFee(id: Item['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/payment/space-fee`,
    {
      method: 'POST',
    },
  )

  revalidateTag('items')

  return res
}
