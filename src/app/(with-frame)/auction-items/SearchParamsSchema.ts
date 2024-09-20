import { AUCTION_ITEM_STATUS } from "@/domain/static/static-config-mappers"
import { PaginationSchema } from '@/domain/static/static'
import * as R from 'remeda'
import { z } from 'zod'

export const SearchParamsSchema = PaginationSchema.extend({
  status: z.coerce
    .number()
    .array()
    .transform(
      R.filter(R.isIncludedIn(AUCTION_ITEM_STATUS.data.map((item) => item.value))),
    )
    .default([
      AUCTION_ITEM_STATUS.enum('InitStatus'),
      AUCTION_ITEM_STATUS.enum('StopBiddingStatus'),
      AUCTION_ITEM_STATUS.enum('HighestBiddedStatus'),
      AUCTION_ITEM_STATUS.enum('NotHighestBiddedStatus'),
      AUCTION_ITEM_STATUS.enum('ClosedStatus'),
      AUCTION_ITEM_STATUS.enum('AwaitingConsignorPayFeeStatus'),
      AUCTION_ITEM_STATUS.enum('ConsignorRequestCancellationStatus'),
    ]),
})
