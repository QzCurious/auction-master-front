import { BonusLog, GetBonusLogs } from '@/api/frontend/bonuses/GetBonusLogs'
import { GetConsignorBonusBalance } from '@/api/frontend/bonuses/GetConsignorBonusBalance'
import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { GetConfigs } from '@/api/frontend/GetConfigs'
import { GetJPYRates } from '@/api/frontend/GetJPYRates'
import { GetConsignorWalletBalance } from '@/api/frontend/wallets/GetConsignorWalletBalance'
import { GetWalletLogs, WalletLog } from '@/api/frontend/wallets/GetWalletLogs'
import { Heading } from '@/catalyst-ui/heading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/catalyst-ui/table'
import { SearchParamsPagination } from '@/components/SearchParamsPagination'
import { HandleApiError } from '@/domain/api/HandleApiError'
import {
  DATE_TIME_FORMAT,
  PAGE,
  PaginationSchema,
  PaginationSearchParams,
  ROWS_PER_PAGE,
  SITE_NAME,
} from '@/domain/static/static'
import {
  BONUS_ACTION,
  CONSIGNOR_STATUS,
  WALLET_ACTION,
} from '@/domain/static/static-config-mappers'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import { addDays, addMonths, format, startOfDay, subDays } from 'date-fns'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect, RedirectType } from 'next/navigation'
import * as R from 'remeda'
import { z } from 'zod'
import DateRangeFilter from './DateRangeFilter'
import WithdrawDialog from './WithdrawDialog'

export const metadata = { title: `帳戶紀錄 | ${SITE_NAME}` } satisfies Metadata

const MAX_MONTHS = 3

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

function fixRange(startAt?: Date, endAt?: Date) {
  const wasValid = validRange(startAt, endAt)

  if (wasValid) {
    return { wasValid, startAt, endAt }
  }

  const defaultEndAt = startOfDay(addDays(new Date(), 1))
  const defaultStartAt = startOfDay(subDays(defaultEndAt, 7))
  return { wasValid, startAt: defaultStartAt, endAt: defaultEndAt }
}

const querySchema = z.intersection(
  z.object({
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
  }),
  z.preprocess(
    z.object({ type: z.enum(['balance', 'bonus']).default('balance') }).parse,
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('balance'),
        action: z
          .preprocess(
            (v) => (typeof v === 'string' ? [v] : v),
            z.coerce
              .number()
              .array()
              .transform(
                R.filter(
                  R.isIncludedIn(WALLET_ACTION.data.map((item) => item.value)),
                ),
              ),
          )
          .default([]),
      }),
      z.object({
        type: z.literal('bonus'),
        action: z
          .preprocess(
            (v) => (typeof v === 'string' ? [v] : v),
            z.coerce
              .number()
              .array()
              .transform(
                R.filter(R.isIncludedIn(BONUS_ACTION.data.map((item) => item.value))),
              ),
          )
          .default([]),
      }),
    ]),
  ),
)

interface PageProps {
  searchParams: PaginationSearchParams & z.output<typeof querySchema>
}

export default async function Page({ searchParams }: PageProps) {
  const query = querySchema.parse(searchParams)
  const pagination = PaginationSchema.parse(searchParams)
  const { wasValid, startAt, endAt } = fixRange(query.startAt, query.endAt)

  const [
    consignorRes,
    configsRes,
    jpyRatesRes,
    balanceRes,
    walletLogsRes,
    bonusRes,
    bonusLogsRes,
  ] = await Promise.all([
    GetConsignor(),
    GetConfigs(),
    GetJPYRates(),
    GetConsignorWalletBalance(),
    query.type === 'balance'
      ? GetWalletLogs({
          startAt,
          endAt,
          sort: 'createdAt',
          order: 'desc',
          limit: pagination[ROWS_PER_PAGE],
          offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
        })
      : null,
    GetConsignorBonusBalance(),
    query.type === 'bonus'
      ? GetBonusLogs({
          startAt,
          endAt,
          sort: 'createdAt',
          order: 'desc',
          limit: pagination[ROWS_PER_PAGE],
          offset: pagination[PAGE] * pagination[ROWS_PER_PAGE],
        })
      : null,
  ])

  if (consignorRes.error) {
    return <HandleApiError error={consignorRes.error} />
  }
  if (configsRes.error) {
    return <HandleApiError error={configsRes.error} />
  }
  if (jpyRatesRes.error) {
    return <HandleApiError error={jpyRatesRes.error} />
  }
  if (balanceRes.error) {
    return <HandleApiError error={balanceRes.error} />
  }
  if (walletLogsRes?.error) {
    return <HandleApiError error={walletLogsRes.error} />
  }
  if (bonusRes.error) {
    return <HandleApiError error={bonusRes.error} />
  }
  if (bonusLogsRes?.error) {
    return <HandleApiError error={bonusLogsRes.error} />
  }

  if (
    consignorRes.data.status ===
    CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
  ) {
    redirect('/me?alert#identity-form-alert', RedirectType.replace)
  }

  return (
    <>
      <div className='flex gap-x-8'>
        <Heading>帳戶紀錄</Heading>

        <div className='ml-auto'>
          {query.type === 'balance' && (
            <WithdrawDialog
              balance={balanceRes.data}
              withdrawalTransferFee={
                consignorRes.data.bankCode === configsRes.data.bankCode
                  ? 0
                  : configsRes.data.withdrawalTransferFee
              }
              jpyExchangeRate={jpyRatesRes.data}
            />
          )}
        </div>
      </div>

      <div className='mt-4 flex gap-x-4'>
        <Link
          href='?type=balance'
          className={clsx(
            'w-full min-w-40 rounded border border-b-4 px-4 py-2 sm:w-auto',
            query.type === 'balance' && 'border-b-indigo-500',
          )}
          title={process.env.NODE_ENV === 'development' ? '日幣' : ''}
        >
          <h2 className=''>大師幣</h2>
          <p className='text-2xl'>{balanceRes.data.toLocaleString()}</p>
        </Link>

        <Link
          href='?type=bonus'
          className={clsx(
            'w-full min-w-40 rounded border border-b-4 px-4 py-2 sm:w-auto',
            query.type === 'bonus' && 'border-b-indigo-500',
          )}
        >
          <h2 className=''>紅利</h2>
          <p className='text-2xl'>{bonusRes.data.toLocaleString()}</p>
        </Link>
      </div>

      <div className='mt-4'>
        {/* {query.type === 'balance' && <AuctionFilter selected={query.action} />} */}
        <DateRangeFilter
          canCancel
          startAt={wasValid ? startAt : undefined}
          endAt={wasValid ? endAt : undefined}
        />
      </div>

      <div className='mt-4'>
        {walletLogsRes && (
          <WalletLogsTable
            rows={walletLogsRes.data.walletLogs}
            count={walletLogsRes.data.count}
          />
        )}
        {bonusLogsRes && (
          <BonusLogsTable
            rows={bonusLogsRes.data.bonusLogs}
            count={bonusLogsRes.data.count}
          />
        )}
      </div>
    </>
  )
}

interface WalletLogsTableProps {
  rows: WalletLog[]
  count: number
}

function WalletLogsTable({ rows, count }: WalletLogsTableProps) {
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
              <TableCell className='text-center'>
                {WALLET_ACTION.get('value', row.action).message}
              </TableCell>
              <TableCell
                className={clsx(
                  'text-end',
                  row.netDifference < 0 ? 'text-rose-600' : 'text-emerald-500',
                )}
              >
                {row.netDifference.toLocaleString()}
              </TableCell>
              <TableCell className='text-end'>
                {(row.previousBalance + row.netDifference).toLocaleString()}
              </TableCell>
              <TableCell className='text-center'>
                {format(row.createdAt, DATE_TIME_FORMAT)}
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
  rows: BonusLog[]
  count: number
}

function BonusLogsTable({ rows, count }: BonusLogsTableProps) {
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
              <TableCell className='text-center'>
                {BONUS_ACTION.get('value', row.action).message}
              </TableCell>
              <TableCell
                className={clsx(
                  'text-end',
                  row.netDifference < 0 ? 'text-rose-600' : 'text-emerald-500',
                )}
              >
                {row.netDifference.toLocaleString()}
              </TableCell>
              <TableCell className='text-end'>
                {(row.previousBalance + row.netDifference).toLocaleString()}
              </TableCell>
              <TableCell className='text-center'>
                {format(row.createdAt, DATE_TIME_FORMAT)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}
