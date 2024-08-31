import { GetRecords, Record } from '@/app/api/frontend/reports/GetRecords'
import { RECORD_STATUS, RECORD_TYPE } from '@/app/api/frontend/static-configs.data'
import { Heading } from '@/app/catalyst-ui/heading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/catalyst-ui/table'
import { SearchParamsPagination } from '@/app/components/SearchParamsPagination'
import RedirectToHome from '@/app/RedirectToHome'
import {
  DATE_TIME_FORMAT,
  PAGE,
  parseSearchParams,
  ROWS_PER_PAGE,
} from '@/app/static'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import { format } from 'date-fns'
import { DesktopFilters, MobileFilters } from './Filters'
import { fixRange, SearchParamsSchema } from './SearchParamsSchema'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const filters = parseSearchParams(SearchParamsSchema, searchParams)
  const { wasValid, startAt, endAt } = fixRange(filters.startAt, filters.endAt)

  const [reportRecordsRes] = await Promise.all([
    GetRecords({
      startAt,
      endAt,
      status: filters.status,
      type: filters.type,
      sort: 'createdAt',
      order: 'desc',
      limit: filters[ROWS_PER_PAGE],
      offset: filters[PAGE] * filters[ROWS_PER_PAGE],
    }),
  ])

  if (reportRecordsRes?.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
      <Heading level={1} className='lg:sr-only'>
        交易紀錄
      </Heading>

      <div className='mt-2.5'>
        <MobileFilters
          startAt={wasValid ? startAt : undefined}
          endAt={wasValid ? endAt : undefined}
          type={filters.type}
          status={filters.status}
        />
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters
          startAt={wasValid ? startAt : undefined}
          endAt={wasValid ? endAt : undefined}
          type={filters.type}
          status={filters.status}
        />

        <ReportRecordTable
          rows={reportRecordsRes.data.records}
          count={reportRecordsRes.data.count}
        />
      </div>
    </div>
  )
}

function ReportSummery() {}

interface ReportRecordTableProps {
  rows: Record[]
  count: number
}

function ReportRecordTable({ rows, count }: ReportRecordTableProps) {
  return (
    <div className='min-w-0 grow'>
      <Table striped>
        <TableHead>
          <TableRow className='text-center'>
            <TableHeader>類型</TableHeader>
            <TableHeader>狀態</TableHeader>
            <TableHeader>細節</TableHeader>
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
          {rows.map((row) => {
            const currencySign = (function () {
              switch (row.currency) {
                case 'JPY':
                  return '¥'
                case 'TWD':
                  return 'NT$'
                default:
                  return '¥'
              }
            })()

            return (
              <TableRow key={row.id}>
                <TableCell className='text-center'>
                  {RECORD_TYPE.get('value', row.type).message}
                </TableCell>
                <TableCell
                  className={clsx(
                    'text-center',
                    row.status === RECORD_STATUS.enum('UnpaidStatus') &&
                      'text-rose-500',
                  )}
                >
                  {RECORD_STATUS.get('value', row.status).message}
                </TableCell>
                <TableCell className='w-0'>
                  <Table dense>
                    <TableBody className='[&>tr:last-child>td]:border-0 [&_td:nth-child(2)]:text-end'>
                      {row.jpyWithdrawal != null && (
                        <TableRow>
                          <TableCell>日幣提款金額</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.jpyWithdrawal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.withdrawal != null && (
                        <TableRow>
                          <TableCell>提款金額</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.withdrawal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.price != null && (
                        <TableRow>
                          <TableCell>計算金額</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.price.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.directPurchasePrice != null && (
                        <TableRow>
                          <TableCell>直購金額</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.directPurchasePrice.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.purchasedPrice != null && (
                        <TableRow>
                          <TableCell>最低買入金額</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.purchasedPrice.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.yahooAuctionFee != null && (
                        <TableRow>
                          <TableCell>日拍手續費</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.yahooAuctionFee.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.commission != null && (
                        <TableRow>
                          <TableCell>平台手續費</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.commission.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.bonus != null && (
                        <TableRow>
                          <TableCell>回饋</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.bonus.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.yahooCancellationFee != null && (
                        <TableRow>
                          <TableCell>日拍取消手續費</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.yahooCancellationFee.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.spaceFee != null && (
                        <TableRow>
                          <TableCell>留倉費</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.spaceFee.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      {row.shippingCost != null && (
                        <TableRow>
                          <TableCell>運費</TableCell>
                          <TableCell>
                            {currencySign}
                            {row.shippingCost.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>時間</TableCell>
                        <TableCell>
                          {format(row.createdAt, DATE_TIME_FORMAT)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}
