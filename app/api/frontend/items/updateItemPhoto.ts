'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  name: z.string(),
  description: z.string(),
  reservePrice: z.number(),
})

type Data = 'Success'

type ErrorCode = never

export async function updateItemPhoto(id: number, formData: FormData) {
  if (formData.getAll('photo').length === 0) {
    throw new Error('photo is required and should be an array of files')
  }
  if (formData.getAll('index').length !== formData.getAll('photo').length) {
    throw new Error('photo and index should have the same length')
  }

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/photo`,
    {
      method: 'PATCH',
      body: formData,
    },
  )

  revalidateTag('items')

  return res
}
