'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { appendEntries } from '@/domain/crud/appendEntries'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  action: z.enum(['approve', 'reject']),
})

type Data = 'Success'

export async function ItemConsignmentReview(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .post<SuccessResponseJson<Data>>(`frontend/items/${id}/consignment`, {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
