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
import { format, startOfDay, subDays, subHours } from 'date-fns'
import Link from 'next/link'
import * as R from 'remeda'
import { DesktopFilters, MobileFilters } from './Filters'
import { isValidInterval, SearchParamsSchema } from './SearchParamsSchema'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const filters = parseSearchParams(SearchParamsSchema, searchParams)

  filters.endAt ??= subHours(new Date(), 1)
  filters.startAt ??= startOfDay(subDays(filters.endAt, 7))
  if (!isValidInterval(filters.startAt, filters.endAt)) {
    filters.endAt = subHours(new Date(), 1)
    filters.startAt = startOfDay(subDays(filters.endAt, 7))
  }

  const [reportRecordsRes] = await Promise.all([
    GetRecords({
      startAt: filters.startAt,
      endAt: filters.endAt,
      status: filters.status,
      type: filters.type,
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
          startAt={filters.startAt}
          endAt={filters.endAt}
          type={filters.type}
          status={filters.status}
        />
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters
          startAt={filters.startAt}
          endAt={filters.endAt}
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className='text-center'>
                {RECORD_TYPE.get('value', row.type).message}
              </TableCell>
              <TableCell className='text-center'>
                {RECORD_STATUS.get('value', row.status).message}
              </TableCell>
              <TableCell>
                <Table dense>
                  <TableBody>
                    {R.entries(row).map(([k, v]) => (
                      <TableRow key={k}>
                        <TableCell>{k}</TableCell>
                        <TableCell>
                          {k === 'type' ? (
                            <>
                              ({v}) {RECORD_TYPE.enum(v)}
                            </>
                          ) : k === 'status' ? (
                            <>
                              ({v}) {RECORD_STATUS.enum(v)}
                            </>
                          ) : k === 'createdAt' || k === 'updatedAt' ? (
                            format(new Date(v), DATE_TIME_FORMAT)
                          ) : k === 'itemID' ? (
                            <Link href={`/dashboard/items/edit/${v}`} target='_blank'>
                              {v}
                            </Link>
                          ) : (
                            v
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SearchParamsPagination count={count} />
    </div>
  )
}