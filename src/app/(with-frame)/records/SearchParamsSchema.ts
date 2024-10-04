import { RECORD_STATUS, RECORD_TYPE } from '@/domain/static/static-config-mappers'
import { PaginationSchema } from '@/domain/static/static'
import { addDays, addMonths, startOfDay, subDays } from 'date-fns'
import * as R from 'remeda'
import { z } from 'zod'

export const MAX_MONTHS = 3

function validRange(startAt?: Date, endAt?: Date) {
  return Boolean(
    startAt &&
      endAt &&
      startAt <= endAt &&
      // let UI handle the max date, cause server can't calculate end of day on user's timezone
      // endAt <= endOfDay(new Date()) &&
      addMonths(startAt, MAX_MONTHS) >= startOfDay(endAt),
  )
}

export function fixRange(startAt?: Date, endAt?: Date) {
  const wasValid = validRange(startAt, endAt)

  if (wasValid) {
    return { wasValid, startAt, endAt }
  }

  const defaultEndAt = startOfDay(addDays(new Date(), 1))
  const defaultStartAt = startOfDay(subDays(defaultEndAt, 7))
  return { wasValid, startAt: defaultStartAt, endAt: defaultEndAt }
}

export const SearchParamsSchema = PaginationSchema.extend({
  'submit-payment': z.string().optional().catch(undefined),
  startAt: z.coerce.date().optional().catch(undefined),
  endAt: z.coerce.date().optional().catch(undefined),
  consignorId: z.coerce.number().optional(),
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
