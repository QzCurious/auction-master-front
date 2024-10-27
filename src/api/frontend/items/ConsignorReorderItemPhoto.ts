'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z.object({
  originalSorted: z.number(),
  newSorted: z.number(),
})

type Data = 'Success'

export async function ConsignorReorderItemPhoto(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .patch<SuccessResponseJson<Data>>(`frontend/items/${id}/photos`, {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
