import { ITEM_STATUS } from '@/app/api/frontend/static-configs.data'
import { PaginationSchema } from '@/app/static'
import * as R from 'remeda'
import { z } from 'zod'


export const SearchParamsSchema = PaginationSchema.extend({
  status: z.coerce
    .number()
    .array()
    .transform(R.filter(R.isIncludedIn(ITEM_STATUS.data.map((item) => item.value))))
    .default([]),
})
