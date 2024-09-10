'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { appendEntries } from '@/app/static'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  action: z.enum(['approve', 'reject']),
})

type Data = 'Success'

type ErrorCode = '1001'

export async function ItemConsignmentReview(
  id: number,
  payload: z.input<typeof ReqSchema>,
) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  appendEntries(formData, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/consignment`,
    {
      method: 'POST',
      body: formData,
    },
  )

  revalidateTag('items')

  return res
}
