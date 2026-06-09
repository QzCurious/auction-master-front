import { type QueryOptions } from '@tanstack/react-query'
import { AuctionItemDealPreview } from './AuctionItemDealPreview'
import { AuctionItem } from './GetConsignorAuctionItems'

export const AuctionItemDealPreviewQueryOptions = (
  auctionId: AuctionItem['auctionId'],
) =>
  ({
    queryKey: ['auction-items-deal-preview', auctionId],
    queryFn: () => AuctionItemDealPreview(auctionId),
  }) satisfies QueryOptions
