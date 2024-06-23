'use server'

import { z } from 'zod'
import { apiClient } from '../../apiClient'
import { throwIfInvalid } from '../../helpers/throwIfInvalid'
import { withAuth } from '../../withAuth'

const ReqSchema = z.object({
  oldPassword: z.string().min(1),
  password: z.string().min(1),
})

type Data = 'Success'

// 11: password cannot be same as old password
// 1004: old password incorrect
type ErrorCode = '11' | '1004'

export async function changePassword(payload: z.input<typeof ReqSchema>) {
  const data = throwIfInvalid(payload, ReqSchema)

  const formData = new FormData()
  formData.append('oldPassword', data.oldPassword)
  formData.append('password', data.password)

  const res = await withAuth(apiClient)<Data, ErrorCode>(
    '/frontend/consignor/password',
    {
      method: 'PATCH',
      body: formData,
    },
  )

  return res
}
