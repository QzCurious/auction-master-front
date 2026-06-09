'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'

import { appendEntries } from '@/domain/crud/appendEntries'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'
import { Record } from './GetRecords'

const ReqSchema = z.object({
  opCode: z.string(),
})

type Data = 'Success'

export async function ConsignorSubmitPayment(
  id: Record['id'],
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .post<
      SuccessResponseJson<Data>
    >(`frontend/reports/records/${id}/submit-payment`, { body: urlencoded })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('records')

  return res
}
