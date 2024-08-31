'use server'

import { revalidateTag } from 'next/cache'

import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'
import { Record } from './GetRecords'

type Data = 'Success'

type ErrorCode = never

export async function ConsignorSubmitPayment(id: Record['id']) {
  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records/${id}/submit-payment`,
    {
      method: 'POST',
    },
  )

  revalidateTag('records')

  return res
}
