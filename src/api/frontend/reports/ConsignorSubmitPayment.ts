'use server'

import { revalidateTag } from 'next/cache'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { Record } from './GetRecords'

const ReqSchema = z.object({
  opCode: z.string(),
})

type Data = 'Success'

type ErrorCode = never

export async function ConsignorSubmitPayment(
  id: Record['id'],
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/reports/records/${id}/submit-payment`,
    {
      method: 'POST',
      body: urlencoded,
    },
  )

  revalidateTag('records')

  return res
}
