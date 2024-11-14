import { GetConsignorAuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItem'
import { AuctionItem } from '@/api/frontend/auction-items/GetConsignorAuctionItems'
import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { Configs, GetConfigs } from '@/api/frontend/GetConfigs'
import { GetConsignorItem, Item } from '@/api/frontend/items/GetConsignorItem'
import { GetRecord } from '@/api/frontend/reports/GetRecord'
import { GetRecords, Record } from '@/api/frontend/reports/GetRecords'
import {
  GetRecordsSummary,
  type RecordSummary,
} from '@/api/frontend/reports/GetRecordsSummary'
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
import { parseSearchParams } from '@/domain/crud/parseSearchParams'
import {
  currencySign,
  DATE_TIME_FORMAT,
  PAGE,
  ROWS_PER_PAGE,
  SITE_NAME,
  yahooAuctionLink,
} from '@/domain/static/static'
import {
  CONSIGNOR_STATUS,
  RECORD_STATUS,
  RECORD_TYPE,
} from '@/domain/static/static-config-mappers'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import { Gavel } from '@phosphor-icons/react/dist/ssr/Gavel'
import { StackSimple } from '@phosphor-icons/react/dist/ssr/StackSimple'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect, RedirectType } from 'next/navigation'
import CancelPayment from './CancelPayment'
import { DesktopFilters, MobileFilters } from './Filters'
import { fixRange, SearchParamsSchema } from './SearchParamsSchema'
import { SubmitPayment, SubmitPaymentDialog } from './SubmitPayment'

export const metadata = { title: `交易紀錄 | ${SITE_NAME}` } satisfies Metadata

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const query = parseSearchParams(SearchParamsSchema, searchParams)
  const { startAt, endAt } = fixRange(query.startAt, query.endAt)

  const [
    consignorRes,
    recordsSummaryRes,
    recordsRes,
    configsRes,
    submitPaymentRecordRes,
  ] = await Promise.all([
    GetConsignor(),
    GetRecordsSummary({
      startAt,
      endAt,
      status: query.status,
      type: query.type,
    }),
    GetRecords({
      startAt,
      endAt,
      status: query.status,
      type: query.type,
      sort: 'createdAt',
      order: 'desc',
      limit: query[ROWS_PER_PAGE],
      offset: query[PAGE] * query[ROWS_PER_PAGE],
    }),
    GetConfigs(),
    query['submit-payment'] && GetRecord(query['submit-payment']),
  ])

  if (consignorRes.error) {
    return <HandleApiError error={consignorRes.error} />
  }
  if (recordsSummaryRes.error) {
    return <HandleApiError error={recordsSummaryRes.error} />
  }
  if (recordsRes.error) {
    return <HandleApiError error={recordsRes.error} />
  }
  if (configsRes.error) {
    return <HandleApiError error={configsRes.error} />
  }
  if (submitPaymentRecordRes && submitPaymentRecordRes.error) {
    return <HandleApiError error={submitPaymentRecordRes.error} />
  }

  if (
    consignorRes.data.status ===
    CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
  ) {
    redirect('/me?alert#identity-form-alert', RedirectType.replace)
  }

  return (
    <div className=''>
      <Heading>交易紀錄</Heading>

      <div className='mt-2.5'>
        <MobileFilters
          startAt={startAt}
          endAt={endAt}
          type={query.type}
          status={query.status}
        />
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters
          startAt={startAt}
          endAt={endAt}
          type={query.type}
          status={query.status}
        />

        <div className='min-w-0 grow'>
          {/* <Heading level={2}>總結</Heading> */}
          <RecordSummary report={recordsSummaryRes.data} />

          <div className='mt-10'>
            <ReportRecordTable
              rows={recordsRes.data.records}
              count={recordsRes.data.count}
              configs={configsRes.data}
            />
          </div>
        </div>
      </div>

      {submitPaymentRecordRes &&
        submitPaymentRecordRes.data.status === RECORD_STATUS.enum('UnpaidStatus') && (
          <SubmitPaymentDialog
            title={(function iife() {
              switch (submitPaymentRecordRes.data.type) {
                case RECORD_TYPE.enum('PayYahooAuctionFeeType'):
                  return '支付日拍手續費'
                case RECORD_TYPE.enum('PayAuctionItemCancellationFeeType'):
                  return '支付日拍取消手續費'
                case RECORD_TYPE.enum('PaySpaceFeeType'):
                  return '支付留倉費'
                case RECORD_TYPE.enum('PayReturnItemFeeType'):
                  return '支付退貨費'
                default:
                  return '發生錯誤'
              }
            })()}
            recordId={submitPaymentRecordRes.data.id}
            amount={(function iife() {
              switch (submitPaymentRecordRes.data.type) {
                case RECORD_TYPE.enum('PayYahooAuctionFeeType'):
                  return submitPaymentRecordRes.data.yahooAuctionFee
                case RECORD_TYPE.enum('PayAuctionItemCancellationFeeType'):
                  return submitPaymentRecordRes.data.yahooCancellationFee
                case RECORD_TYPE.enum('PaySpaceFeeType'):
                  return submitPaymentRecordRes.data.spaceFee
                case RECORD_TYPE.enum('PayReturnItemFeeType'):
                  return submitPaymentRecordRes.data.shippingCost
                default:
                  return undefined
              }
            })()}
            bankName={configsRes.data.bankName}
            bankCode={configsRes.data.bankCode}
            bankAccount={configsRes.data.bankAccount}
          />
        )}
    </div>
  )
}

function RecordSummary({ report }: { report: RecordSummary }) {
  // v6 https://docs.google.com/spreadsheets/d/1S2-9S-AOAJG5a_hHFlA1N6YN1W5LZjpZzptL2UgBj5w/edit?gid=1521339545#gid=1521339545
  return (
    <div className='flex items-start gap-x-6 overflow-auto [&_td:last-child]:text-end'>
      <Table
        dense
        className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'
      >
        <TableBody>
          <TableRow>
            <TableCell>提款日幣</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalJpyWithdrawal.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>提款台幣</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalWithdrawal.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>提款手續費</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalWithdrawalTransferFee.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table
        dense
        className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'
      >
        <TableBody>
          <TableRow>
            <TableCell>結算金額</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalPrice.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>直購金額</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalDirectPurchasePrice.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>買回金額</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalPurchasedPrice.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>日拍手續費</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalYahooAuctionFeeJpy.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>日拍手續費</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalYahooAuctionFee.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>平台手續費</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalCommission.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>回饋金額</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalBonus.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table
        dense
        className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'
      >
        <TableBody>
          <TableRow>
            <TableCell>留倉費</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalSpaceFeeJpy.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>留倉費</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalSpaceFee.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>運費</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalShippingCost.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table
        dense
        className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'
      >
        <TableBody>
          <TableRow>
            <TableCell>日拍取消手續費</TableCell>
            <TableCell>
              {currencySign('JPY')}
              {report.totalYahooCancellationFeeJpy.toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>日拍取消手續費</TableCell>
            <TableCell>
              {currencySign('TWD')}
              {report.totalYahooCancellationFee.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

interface ReportRecordTableProps {
  rows: Record[]
  count: number
  configs: Configs
}

function ReportRecordTable({ rows, count, configs }: ReportRecordTableProps) {
  return (
    <div>
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
              <TableCell
                className='text-center'
                title={
                  process.env.NODE_ENV === 'development'
                    ? `${row.type} ${RECORD_TYPE.enum(row.type)}`
                    : undefined
                }
              >
                {RECORD_TYPE.get('value', row.type).message}
                <AllKindsOfLinks row={row} />
              </TableCell>
              <TableCell
                className={clsx(
                  'text-center',
                  row.status === RECORD_STATUS.enum('UnpaidStatus') &&
                    'text-rose-500',
                )}
                title={
                  process.env.NODE_ENV === 'development'
                    ? `${row.status} ${RECORD_STATUS.enum(row.status)}`
                    : undefined
                }
              >
                {RECORD_STATUS.get('value', row.status).message}

                {row.status === RECORD_STATUS.enum('UnpaidStatus') && (
                  <div className='mt-2 flex justify-center gap-x-2'>
                    <CancelPayment recordId={row.id} />
                    <SubmitPayment
                      title={(function iife() {
                        switch (row.type) {
                          case RECORD_TYPE.enum('PayYahooAuctionFeeType'):
                            return '支付日拍手續費'
                          case RECORD_TYPE.enum('PayAuctionItemCancellationFeeType'):
                            return '支付日拍取消手續費'
                          case RECORD_TYPE.enum('PaySpaceFeeType'):
                            return '支付留倉費'
                          case RECORD_TYPE.enum('PayReturnItemFeeType'):
                            return '支付退貨費'
                          default:
                            return '發生錯誤'
                        }
                      })()}
                      recordId={row.id}
                      amount={(function iife() {
                        switch (row.type) {
                          case RECORD_TYPE.enum('PayYahooAuctionFeeType'):
                            return row.yahooAuctionFee
                          case RECORD_TYPE.enum('PayAuctionItemCancellationFeeType'):
                            return row.yahooCancellationFee
                          case RECORD_TYPE.enum('PaySpaceFeeType'):
                            return row.spaceFee
                          case RECORD_TYPE.enum('PayReturnItemFeeType'): {
                            if (row.shippingCost == null || row.spaceFee == null)
                              return undefined
                            return row.shippingCost + row.spaceFee
                          }
                          default:
                            return undefined
                        }
                      })()}
                      bankName={configs.bankName}
                      bankAccount={configs.bankAccount}
                      bankCode={configs.bankCode}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell className='w-0'>
                {/* v5 https://docs.google.com/spreadsheets/d/1S2-9S-AOAJG5a_hHFlA1N6YN1W5LZjpZzptL2UgBj5w/edit?gid=1734093702#gid=1734093702 */}
                <Table dense>
                  <TableBody className='[&>tr:last-child>td]:border-0 [&_td:nth-child(2)]:text-end'>
                    {row.jpyWithdrawal != null && (
                      <TableRow>
                        <TableCell>日幣提款金額</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.jpyWithdrawal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.withdrawal != null && (
                      <TableRow>
                        <TableCell>提款金額</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.withdrawal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.withdrawalTransferFee != null && (
                      <TableRow>
                        <TableCell>提款手續費</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.withdrawalTransferFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.price != null && (
                      <TableRow>
                        <TableCell>計算金額</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.price.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.directPurchasePrice != null && (
                      <TableRow>
                        <TableCell>直購金額</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.directPurchasePrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.purchasedPrice != null && (
                      <TableRow>
                        <TableCell>最低買入金額</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.purchasedPrice.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.yahooAuctionFeeJpy != null && (
                      <TableRow>
                        <TableCell>日拍手續費</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.yahooAuctionFeeJpy.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.yahooAuctionFee != null && (
                      <TableRow>
                        <TableCell>日拍手續費</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.yahooAuctionFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.commission != null && (
                      <TableRow>
                        <TableCell>平台手續費</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.commission.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.bonus != null && (
                      <TableRow>
                        <TableCell>回饋</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.bonus.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.yahooCancellationFeeJpy != null && (
                      <TableRow>
                        <TableCell>日拍取消手續費</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.yahooCancellationFeeJpy.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.yahooCancellationFee != null && (
                      <TableRow>
                        <TableCell>日拍取消手續費</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.yahooCancellationFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.spaceFeeJpy != null && (
                      <TableRow>
                        <TableCell>留倉費</TableCell>
                        <TableCell>
                          {currencySign('JPY')}
                          {row.spaceFeeJpy.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.spaceFee != null && (
                      <TableRow>
                        <TableCell>留倉費</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.spaceFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {row.shippingCost != null && (
                      <TableRow>
                        <TableCell>運費</TableCell>
                        <TableCell>
                          {currencySign('TWD')}
                          {row.shippingCost.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>時間</TableCell>
                      <TableCell>{format(row.createdAt, DATE_TIME_FORMAT)}</TableCell>
                    </TableRow>
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

async function ItemLink({ itemId }: { itemId: Item['id'] }) {
  const itemRes = await GetConsignorItem(itemId)
  if (!itemRes.data) return null

  return (
    <Link
      className='text-indigo-400 underline hover:text-indigo-500'
      href={`/items/edit/${itemId}`}
      target='_blank'
      rel='noreferrer'
    >
      {itemRes.data.name}{' '}
      <ArrowTopRightOnSquareIcon className='inline-block h-4 w-4' />
    </Link>
  )
}

async function AuctionItemLink({
  auctionId,
}: {
  auctionId: AuctionItem['auctionId']
}) {
  const auctionItemRes = await GetConsignorAuctionItem(auctionId)
  if (!auctionItemRes.data) return null

  return (
    <Link
      className='text-indigo-400 underline hover:text-indigo-500'
      href={yahooAuctionLink(auctionId)}
      target='_blank'
      rel='noreferrer'
    >
      {auctionItemRes.data.name}{' '}
      <ArrowTopRightOnSquareIcon className='inline-block h-4 w-4' />
    </Link>
  )
}

async function AllKindsOfLinks({ row }: { row: Record }) {
  if (row.auctionIds && row.auctionIds.length > 0) {
    const auctionItemRes = await Promise.all(
      row.auctionIds.map((x) => GetConsignorAuctionItem(x)),
    )
    const itemRes = await Promise.all(
      auctionItemRes.map((x) =>
        x.data?.itemId ? GetConsignorItem(x.data.itemId) : null,
      ),
    )

    return (
      <div className='mx-auto mt-1 flex w-fit gap-x-2 text-indigo-400'>
        {row.auctionIds?.map((auctionId, i) => (
          <div key={auctionId} className='flex gap-x-3'>
            <div>
              {itemRes[i]?.data && (
                <Link
                  className='text-link'
                  title={itemRes[i].data.name}
                  href={`/items/edit/${itemRes[i].data.id}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <StackSimple fontSize='large' />
                </Link>
              )}
            </div>
            <div>
              {auctionItemRes[i]?.data && (
                <Link
                  className='text-link'
                  title={auctionItemRes[i].data.name}
                  href={`/auction-items/${auctionItemRes[i].data.auctionId}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Gavel fontSize='large' />
                </Link>
              )}
            </div>
            <div>
              <Link
                className='text-link'
                href={yahooAuctionLink(auctionId)}
                target='_blank'
                rel='noreferrer'
              >
                {auctionId}
              </Link>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (row.itemIds && row.itemIds.length > 0) {
    const itemRes = await Promise.all(row.itemIds.map((x) => GetConsignorItem(x)))

    return (
      <div className='mx-auto mt-1 flex w-fit gap-x-2 text-indigo-400'>
        {row.itemIds?.map((itemId, i) => (
          <div key={itemId} className='flex gap-x-3'>
            <div>
              {itemRes[i]?.data && (
                <Link
                  className='text-link'
                  title={itemRes[i].data.name}
                  href={`/items/edit/${itemRes[i].data.id}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <StackSimple fontSize='large' />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
