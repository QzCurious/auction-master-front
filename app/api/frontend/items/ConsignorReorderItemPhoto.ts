'use server'

import { appendEntries } from '@/app/static'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  originalSorted: z.number(),
  newSorted: z.number(),
})

type Data = 'Success'

type ErrorCode = never

export async function ConsignorReorderItemPhoto(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  appendEntries(formData, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/photos`,
    {
      method: 'PATCH',
      body: formData,
    },
  )

  revalidateTag('items')

  return res
}
