'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  name: z.string(),
  description: z.string(),
  reservePrice: z.number(),
})

type Data = 'Success'

type ErrorCode = never

export async function updateItem(id: number, payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('reservePrice', data.reservePrice.toString())

  const res = await withAuth(apiClient)<Data, ErrorCode>(`/frontend/items/${id}`, {
    method: 'PATCH',
    body: formData,
  })

  revalidateTag('items')

  return res
}
