'use server'

import { apiClientWithToken } from '@/api/core/apiClientWithToken'
import { createApiErrorServerSide } from '@/api/core/ApiError/createApiErrorServerSide'
import { SuccessResponseJson } from '@/api/core/static'
import { appendEntries } from '@/domain/crud/appendEntries'
import { ITEM_TYPE } from '@/domain/static/static-config-mappers'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { throwIfInvalid } from '@/api/core/static'

const ReqSchema = z
  .object({
    name: z.string(),
    type: z
      .number()
      .refine((i) =>
        i === 0 ? true : !!ITEM_TYPE.data.find(({ value }) => i === value),
      ),
    isNew: z.boolean(),
    reservePrice: z.number(),
    description: z.string(),
  })
  .partial()

type Data = 'Success'

export async function UpdateConsignorItem(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await apiClientWithToken
    .patch<SuccessResponseJson<Data>>(`frontend/items/${id}`, {
      body: urlencoded,
    })
    .json()
    .catch(createApiErrorServerSide)

  revalidateTag('items')

  return res
}
