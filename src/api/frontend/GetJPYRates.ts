'use server'

import { apiClient } from '../apiClient'
import { withAuth } from '../withAuth'

export interface ExchangeRate {
  buying: number
  selling: number
}

interface Data extends ExchangeRate {}

type ErrorCode = never

export async function GetJPYRates() {
  const res = await withAuth(apiClient)<Data, ErrorCode>('/frontend/jpy-rates', {
    method: 'GET',
    next: { tags: ['jpy-rates'] },
  })

  return res
}
