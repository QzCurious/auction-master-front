import { RECORD_STATUS, RECORD_TYPE } from '@/app/api/frontend/static-configs.data'
import { PaginationSchema } from '@/app/static'
import { addMonths } from 'date-fns'
import * as R from 'remeda'
import { z } from 'zod'

export const MAX_MONTHS = 3

export function isValidInterval(startAt: Date, endAt: Date) {
  return (
    startAt && endAt && startAt <= endAt && addMonths(startAt, MAX_MONTHS) >= endAt
  )
}

export const SearchParamsSchema = PaginationSchema.extend({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  consignorID: z.coerce.number().optional(),
  type: z.coerce
    .number()
    .array()
    .transform(R.filter(R.isIncludedIn(RECORD_TYPE.data.map((item) => item.value))))
    .default([]),
  status: z.coerce
    .number()
    .array()
    .transform(R.filter(R.isIncludedIn(RECORD_STATUS.data.map((item) => item.value))))
    .default([]),
})
