'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Record } from './GetRecords'

type Data = 'Success'

type ErrorCode = never

export async function ConsignorCancelPayment(id: Record['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records/${id}/cancel-payment`,
    {
      method: 'POST',
    },
  )

  revalidateTag('records')

  return res
}
