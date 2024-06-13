import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../apiClient'
import { throwIfInvalid } from '../helpers/throwIfInvalid'
import { withAuth } from '../withAuth'

const ReqSchema = z.object({
  photo: z.any().refine((file) => file !== null, { message: 'Photo is required' }),
  index: z.number(),
})

type Data = 'Success'

type ErrorCode = never

export async function addPhotosForItem(id: number, formData: FormData) {
  throwIfInvalid(
    {
      photo: formData.get('photo'),
      index: Number(formData.get('index')),
    },
    ReqSchema,
  )

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/photo`,
    {
      method: 'POST',
      body: formData,
    },
  )

  revalidateTag('items')

  return res
}
