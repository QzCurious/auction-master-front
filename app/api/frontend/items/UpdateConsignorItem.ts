'use server'

import { appendEntries } from '@/app/static'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { ITEM_TYPE } from '../static-configs.data'

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

type ErrorCode = never

export async function UpdateConsignorItem(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'PATCH',
    body: urlencoded,
  })

  revalidateTag('items')

  return res
}
