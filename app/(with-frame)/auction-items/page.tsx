import {
  AuctionItem,
  GetConsignorAuctionItems,
} from '@/app/api/frontend/auction-items/GetConsignorAuctionItems'
import { AUCTION_ITEM_STATUS } from '@/app/api/frontend/static-configs.data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/catalyst-ui/table'
import AutoRefreshPage from '@/app/components/AutoRefreshPage'
import { CountdownTime } from '@/app/components/CountdownTime'
import { SearchParamsPagination } from '@/app/components/SearchParamsPagination'
import RedirectToHome from '@/app/RedirectToHome'
import {
  PAGE,
  PaginationSchema,
  PaginationSearchParams,
  ROWS_PER_PAGE,
} from '@/app/static'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import Image from 'next/image'
import { z } from 'zod'

const querySchema = z.object({
  status: z.coerce.number().optional(),
})

interface PageProps {
  searchParams: PaginationSearchParams & z.output<typeof querySchema>
}

export default async function Page({ searchParams }: PageProps) {
  const query = querySchema.parse(searchParams)
  const pagination = PaginationSchema.parse(searchParams)

  const [auctionItemsRes] = await Promise.all([
    GetConsignorAuctionItems({
      limit: pagination[ROWS_PER_PAGE],
      offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
    }),
  ])

  if (auctionItemsRes?.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <AutoRefreshPage ms={10_000}>
      <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <h1 className='sr-only'>競標列表</h1>

        <div className='mt-8 flex justify-between gap-x-8'>
          <h2 className='text-2xl'></h2>
        </div>

        <div className='mt-4'>
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
    <div>
      <Table>
        <TableHead>
          <TableRow className='text-center'>
            <TableHeader>商品圖片</TableHeader>
            <TableHeader>商品名稱</TableHeader>
            <TableHeader>當前金額</TableHeader>
            <TableHeader>結標倒數</TableHeader>
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
                <Image
                  className='mx-auto h-20 w-20 rounded-md object-cover'
                  src={row.photo}
                  width={200}
                  height={200}
                  alt={row.name}
                />
              </TableCell>
              <TableCell>
                <p>{row.name}</p>
                {row.status ===
                  AUCTION_ITEM_STATUS.enum('AwaitingConsignorPayFeeStatus') && (
                  <p className='italic text-indigo-500'>
                    尚有日拍手續費未付，請聯絡客服
                  </p>
                )}
              </TableCell>
              <TableCell
                className={clsx(
                  'text-end',
                  row.currentPrice >= row.reservePrice
                    ? 'text-emerald-500'
                    : 'text-rose-600',
                )}
              >
                {row.currentPrice.toLocaleString()}
              </TableCell>
              <TableCell className='text-center'>
                <CountdownTime until={new Date(row.closeAt)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}
