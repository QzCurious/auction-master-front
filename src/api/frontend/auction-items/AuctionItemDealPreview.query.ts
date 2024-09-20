import { type QueryOptions } from '@tanstack/react-query'
import { AuctionItemDealPreview } from './AuctionItemDealPreview'
import { AuctionItem } from './GetConsignorAuctionItems'

export const AuctionItemDealPreviewQueryOptions = (id: AuctionItem['id']) =>
  ({
    queryKey: ['auction-items-deal-preview', id],
    queryFn: () => AuctionItemDealPreview(id),
  }) satisfies QueryOptions
