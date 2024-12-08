import { AuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/catalyst-ui/table'
import { TextLink } from '@/catalyst-ui/text'
import { CountdownTime } from '@/components/CountdownTime'
import { SearchParamsPagination } from '@/components/SearchParamsPagination'
import { currencySign, yahooAuctionLink } from '@/domain/static/static'
import { AUCTION_ITEM_STATUS } from '@/domain/static/static-config-mappers'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import * as R from 'remeda'
import CancelBiddingPopover from './CancelBiddingPopover'
import PayFeePopover from './PayFeePopover'
import PreviewDealPopover from './PreviewDealPopover'

interface AuctionItemsTableProps {
  rows: AuctionItem[]
  count: number
}

export function AuctionItemsTable({ rows, count }: AuctionItemsTableProps) {
  return (
    <div className='min-w-0 grow'>
      <Table>
        <TableHead>
          <TableRow className='text-center'>
            <TableHeader>商品圖片</TableHeader>
            <TableHeader>商品名稱</TableHeader>
            <TableHeader>當前金額</TableHeader>
            <TableHeader>狀態</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={999} className='text-center'>
                <div className='grid place-items-center py-20'>
                  <div className='mx-auto w-fit text-zinc-400'>
                    <FileDashed className='mx-auto size-20' />
                    <p className='mt-6 text-center text-lg leading-6'>沒有資料</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
          {rows?.map((row) => (
            <TableRow key={row.auctionId}>
              <TableCell>
                <a
                  title={
                    process.env.NODE_ENV === 'development'
                      ? row.auctionId.toString()
                      : undefined
                  }
                  href={yahooAuctionLink(row.auctionId)}
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    className='mx-auto h-20 w-20 rounded-md object-cover'
                    src={row.photo}
                    width={200}
                    height={200}
                    alt={row.name}
                  />
                </a>
              </TableCell>
              <TableCell className='min-w-52 whitespace-normal'>
                <TextLink
                  title={
                    process.env.NODE_ENV === 'development'
                      ? row.auctionId.toString()
                      : undefined
                  }
                  href={yahooAuctionLink(row.auctionId)}
                  target='_blank'
                  rel='noreferrer'
                >
                  {row.name}
                </TextLink>
              </TableCell>
              <TableCell className='text-center'>
                <span className='text-zinc-500'>{currencySign('JPY')}</span>
                <span
                  className={clsx(
                    row.currentPrice >= row.reservePrice
                      ? 'text-emerald-500'
                      : 'text-rose-600',
                  )}
                >
                  {row.currentPrice.toLocaleString()}
                </span>
                {/* <span
                  title={
                    process.env.NODE_ENV === 'development' ? '期望金額' : undefined
                  }
                  className='text-zinc-500'
                >
                  / {row.reservePrice.toLocaleString()}
                </span> */}
              </TableCell>
              <TableCell
                className='text-center'
                title={
                  process.env.NODE_ENV === 'development'
                    ? `id:${row.auctionId} status:${AUCTION_ITEM_STATUS.enum(row.status)} recordId:${row.recordId}`
                    : undefined
                }
              >
                {R.isIncludedIn(row.status, [
                  AUCTION_ITEM_STATUS.enum('InitStatus'),
                  AUCTION_ITEM_STATUS.enum('StopBiddingStatus'),
                  AUCTION_ITEM_STATUS.enum('HighestBiddedStatus'),
                  AUCTION_ITEM_STATUS.enum('NotHighestBiddedStatus'),
                ]) ? (
                  <div className='flex flex-col items-center gap-y-1'>
                    <CountdownTime until={new Date(row.closeAt)} />
                    {row.recordId ? (
                      <TextLink href={`/records?submit-payment=${row.recordId}`}>
                        已申請匯款支付
                      </TextLink>
                    ) : (
                      <CancelBiddingPopover auctionItem={row} />
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-y-1'>
                    <div>{AUCTION_ITEM_STATUS.get('value', row.status).message}</div>
                    {R.isIncludedIn(row.status, [
                      AUCTION_ITEM_STATUS.enum('SoldStatus'),
                      AUCTION_ITEM_STATUS.enum('ClosedStatus'),
                    ]) && <PreviewDealPopover auctionId={row.auctionId} />}
                    {row.status ===
                      AUCTION_ITEM_STATUS.enum('AwaitingConsignorPayFeeStatus') &&
                      (row.recordId ? (
                        <TextLink href={`/records?submit-payment=${row.recordId}`}>
                          已申請匯款支付
                        </TextLink>
                      ) : (
                        <PayFeePopover auctionId={row.auctionId} />
                      ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}
