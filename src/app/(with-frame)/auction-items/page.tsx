import {
  AuctionItem,
  GetConsignorAuctionItems,
} from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import { getUser } from '@/api/helpers/getUser'
import { Heading } from '@/catalyst-ui/heading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/catalyst-ui/table'
import { TextLink } from '@/catalyst-ui/text'
import AutoRefreshPage from '@/components/AutoRefreshPage'
import { CountdownTime } from '@/components/CountdownTime'
import { SearchParamsPagination } from '@/components/SearchParamsPagination'
import RedirectAuthError from '@/domain/auth/RedirectAuthError'
import { parseSearchParams } from '@/domain/crud/parseSearchParams'
import { currencySign, PAGE, ROWS_PER_PAGE, SITE_NAME } from '@/domain/static/static'
import {
  AUCTION_ITEM_STATUS,
  CONSIGNOR_STATUS,
} from '@/domain/static/static-config-mappers'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import { Metadata } from 'next'
import Image from 'next/image'
import { redirect, RedirectType } from 'next/navigation'
import * as R from 'remeda'
import CancelBiddingPopover from './CancelBiddingPopover'
import { DesktopFilters, MobileFilters } from './Filters'
import PayFeePopover from './PayFeePopover'
import PreviewDealPopover from './PreviewDealPopover'
import { SearchParamsSchema } from './SearchParamsSchema'

export const metadata = { title: `競標列表 | ${SITE_NAME}` } satisfies Metadata

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const user = await getUser()
  if (
    user?.status === CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
  ) {
    redirect('/me?alert#identity-form-alert', RedirectType.replace)
  }

  const filters = parseSearchParams(SearchParamsSchema, searchParams)

  const [auctionItemsRes] = await Promise.all([
    GetConsignorAuctionItems({
      status: filters.status,
      sort: 'createdAt',
      order: 'desc',
      limit: filters[ROWS_PER_PAGE],
      offset: filters[PAGE] * filters[ROWS_PER_PAGE],
    }),
  ])

  if (auctionItemsRes?.error === '1003') {
    return <RedirectAuthError />
  }

  return (
    <AutoRefreshPage ms={10_000}>
      <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <Heading level={1} className='lg:sr-only'>
          競標列表
        </Heading>

        <div className='mt-2.5'>
          <MobileFilters selected={filters.status} />
        </div>

        <div className='mt-6 sm:flex sm:gap-16'>
          <DesktopFilters selected={filters.status} />

          <AuctionItemsTable
            rows={auctionItemsRes.data.auctionItems}
            count={auctionItemsRes.data.count}
          />
        </div>
      </div>
    </AutoRefreshPage>
  )
}

interface AuctionItemsTableProps {
  rows: AuctionItem[]
  count: number
}

function AuctionItemsTable({ rows, count }: AuctionItemsTableProps) {
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
            <TableRow key={row.id}>
              <TableCell>
                <a
                  title={
                    process.env.NODE_ENV === 'development'
                      ? row.id.toString()
                      : undefined
                  }
                  href={`https://page.auctions.yahoo.co.jp/jp/auction/${row.auctionID}`}
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
                      ? row.id.toString()
                      : undefined
                  }
                  href={`https://page.auctions.yahoo.co.jp/jp/auction/${row.auctionID}`}
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
                </span>{' '}
                <span title='期望金額' className='text-zinc-500'>
                  / {row.reservePrice.toLocaleString()}
                </span>
              </TableCell>
              <TableCell
                className='text-center'
                title={
                  process.env.NODE_ENV === 'development'
                    ? `id:${row.id} status:${AUCTION_ITEM_STATUS.enum(row.status)} recordID:${row.recordID}`
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
                    {row.recordID ? (
                      <TextLink href={`/records?submit-payment=${row.recordID}`}>
                        已申請匯款支付
                      </TextLink>
                    ) : (
                      <CancelBiddingPopover auctionItem={row} />
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-y-1'>
                    <div>{AUCTION_ITEM_STATUS.get('value', row.status).message}</div>
                    {row.status === AUCTION_ITEM_STATUS.enum('ClosedStatus') && (
                      <PreviewDealPopover auctionItemId={row.id} />
                    )}
                    {row.status ===
                      AUCTION_ITEM_STATUS.enum('AwaitingConsignorPayFeeStatus') &&
                      (row.recordID ? (
                        <TextLink href={`/records?submit-payment=${row.recordID}`}>
                          已申請匯款支付
                        </TextLink>
                      ) : (
                        <PayFeePopover auctionItemId={row.id} />
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