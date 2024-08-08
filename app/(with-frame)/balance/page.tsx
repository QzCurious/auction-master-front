import { GetBonusLogs } from '@/app/api/frontend/bonuses/GetBonusLogs'
import { GetConsignorBonusBalance } from '@/app/api/frontend/bonuses/GetConsignorBonusBalance'
import { GetConsignorWalletBalance } from '@/app/api/frontend/wallets/GetConsignorWalletBalance'
import { GetWalletLogs, WalletLog } from '@/app/api/frontend/wallets/GetWalletLogs'
import { Button } from '@/app/catalyst-ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/catalyst-ui/table'
import AutoRefreshPage from '@/app/components/AutoRefreshPage'
import { SearchParamsPagination } from '@/app/components/SearchParamsPagination'
import RedirectToHome from '@/app/RedirectToHome'
import {
  DATE_TIME_FORMAT,
  PAGE,
  PaginationSchema,
  PaginationSearchParams,
  ROWS_PER_PAGE,
} from '@/app/static'
import clsx from 'clsx'
import { format } from 'date-fns'
import Link from 'next/link'
import { z } from 'zod'

const querySchema = z.object({
  type: z.enum(['balance', 'bonus']).default('balance'),
})

interface PageProps {
  searchParams: PaginationSearchParams & z.input<typeof querySchema>
}

export default async function Page({ searchParams }: PageProps) {
  const query = querySchema.parse(searchParams)
  const pagination = PaginationSchema.parse(searchParams)

  const [balanceRes, walletLogsRes, bonusRes, bonusLogsRes] = await Promise.all([
    GetConsignorWalletBalance(),
    query.type === 'balance'
      ? GetWalletLogs({
          limit: pagination[ROWS_PER_PAGE],
          offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
        })
      : null,
    GetConsignorBonusBalance(),
    query.type === 'bonus'
      ? GetBonusLogs({
          limit: pagination[ROWS_PER_PAGE],
          offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
        })
      : null,
  ])

  if (
    balanceRes.error === '1003' ||
    walletLogsRes?.error === '1003' ||
    bonusRes.error === '1003' ||
    bonusLogsRes?.error === '1003'
  ) {
    return <RedirectToHome />
  }

  return (
    <AutoRefreshPage ms={10_000}>
      <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <h1 className='sr-only'>帳戶餘額</h1>

        <div className='flex items-center justify-between gap-x-8'>
          <div className='flex gap-x-4'>
            <Link
              href='?type=balance'
              className={clsx(
                'min-w-40 rounded border border-b-4 px-4 py-2',
                query.type === 'balance' && 'border-b-indigo-500',
              )}
            >
              <h2 className=''>餘額</h2>
              <p className='text-2xl'>¥ {balanceRes.data.toLocaleString()}</p>
            </Link>

            <Link
              href='?type=bonus'
              className={clsx(
                'min-w-40 rounded border border-b-4 px-4 py-2',
                query.type === 'bonus' && 'border-b-indigo-500',
              )}
            >
              <h2 className=''>紅利</h2>
              <p className='text-2xl'>Ⓑ {bonusRes.data.toLocaleString()}</p>
            </Link>
          </div>

          <Button type='button' outline>
            我要提款
          </Button>
        </div>

        <h2 className='mt-8 text-2xl'>
          {query.type === 'balance' ? '餘額紀錄' : '紅利紀錄'}
        </h2>
        <div className='mt-4'>
          {walletLogsRes && (
            <WalletLogsTable
              logs={walletLogsRes.data.walletLogs}
              count={walletLogsRes.data.count}
            />
          )}
          {bonusLogsRes && (
            <BonusLogsTable
              logs={bonusLogsRes.data.bonusLogs}
              count={bonusLogsRes.data.count}
            />
          )}
        </div>
      </div>
    </AutoRefreshPage>
  )
}

interface WalletLogsTableProps {
  logs: WalletLog[]
  count: number
}

function WalletLogsTable({ logs, count }: WalletLogsTableProps) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow className='text-center'>
            <TableHeader>操作</TableHeader>
            <TableHeader>異動額</TableHeader>
            <TableHeader>餘額</TableHeader>
            <TableHeader>時間</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell className='text-center'>{log.action}</TableCell>
              <TableCell className='text-end'>
                {log.netDifference.toLocaleString()}
              </TableCell>
              <TableCell className='text-end'>
                {(log.previousBalance + log.netDifference).toLocaleString()}
              </TableCell>
              <TableCell className='text-center'>
                {format(log.createdAt, DATE_TIME_FORMAT)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}

interface BonusLogsTableProps {
  logs: WalletLog[]
  count: number
}

function BonusLogsTable({ logs, count }: BonusLogsTableProps) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow className='text-center'>
            <TableHeader>操作</TableHeader>
            <TableHeader>異動額</TableHeader>
            <TableHeader>餘額</TableHeader>
            <TableHeader>時間</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell className='text-center'>{log.action}</TableCell>
              <TableCell className='text-end'>
                {log.netDifference.toLocaleString()}
              </TableCell>
              <TableCell className='text-end'>
                {(log.previousBalance + log.netDifference).toLocaleString()}
              </TableCell>
              <TableCell className='text-center'>
                {format(log.createdAt, DATE_TIME_FORMAT)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}
