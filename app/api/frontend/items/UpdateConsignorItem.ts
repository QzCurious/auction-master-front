'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'
import { ITEM_TYPE_DATA } from '../GetFrontendConfigs.data'

const ReqSchema = z.object({
  name: z.string(),
  type: z
    .number()
    .refine((i) =>
      i === 0 ? true : !!ITEM_TYPE_DATA.find(({ value }) => i === value),
    ),
  reservePrice: z.number(),
  description: z.string().optional(),
})

type Data = 'Success'

type ErrorCode = never

export async function UpdateConsignorItem(id: number, payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('type', data.type.toString())
  formData.append('reservePrice', data.reservePrice.toString())
  data.description && formData.append('description', data.description)

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'PATCH',
    body: formData,
  })

  revalidateTag('items')

  return res
}
