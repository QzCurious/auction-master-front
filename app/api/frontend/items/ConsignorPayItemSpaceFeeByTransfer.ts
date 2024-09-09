'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Record } from '../reports/GetRecords'
import { Item } from './GetConsignorItem'

type Data = Record['id']

type ErrorCode = never

export async function ConsignorPayItemSpaceFeeByTransfer(id: Item['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/payment/space-fee-by-transfer`,
    {
      method: 'POST',
    },
  )

  revalidateTag('items')

  return res
}
