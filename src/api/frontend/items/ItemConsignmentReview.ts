'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { appendEntries } from '@/domain/crud/appendEntries'
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

  const urlencoded = new URLSearchParams()
  appendEntries(urlencoded, data)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    `/frontend/items/${id}/consignment`,
    {
      method: 'POST',
      body: urlencoded,
    },
  )

  revalidateTag('items')

  return res
}
