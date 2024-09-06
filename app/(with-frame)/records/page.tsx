import { Configs, GetConfigs } from '@/app/api/frontend/GetConfigs'
import { GetRecord } from '@/app/api/frontend/reports/GetRecord'
import { GetRecords, Record } from '@/app/api/frontend/reports/GetRecords'
import {
  GetRecordsSummary,
  type RecordSummary,
} from '@/app/api/frontend/reports/GetRecordsSummary'
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
  currencySign,
  DATE_TIME_FORMAT,
  PAGE,
  parseSearchParams,
  ROWS_PER_PAGE,
} from '@/app/static'
import { FileDashed } from '@phosphor-icons/react/dist/ssr/FileDashed'
import clsx from 'clsx'
import { format } from 'date-fns'
import * as R from 'remeda'
import CancelPayment from './CancelPayment'
import { DesktopFilters, MobileFilters } from './Filters'
import { fixRange, SearchParamsSchema } from './SearchParamsSchema'
import { SubmitPayment, SubmitPaymentDialog } from './SubmitPayment'

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: PageProps) {
  const query = parseSearchParams(SearchParamsSchema, searchParams)
  const { wasValid, startAt, endAt } = fixRange(query.startAt, query.endAt)

  const [recordsSummaryRes, recordsRes, configsRes, submitPaymentRecordRes] =
    await Promise.all([
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

  if (
    recordsSummaryRes.error === '1003' ||
    recordsRes.error === '1003' ||
    configsRes.error === '1003' ||
    (submitPaymentRecordRes && submitPaymentRecordRes.error === '1003')
  ) {
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
          type={query.type}
          status={query.status}
        />
      </div>

      <div className='mt-6 sm:flex sm:gap-16'>
        <DesktopFilters
          startAt={wasValid ? startAt : undefined}
          endAt={wasValid ? endAt : undefined}
          type={query.type}
          status={query.status}
        />

        <div className='min-w-0 grow'>
          <section className='flex items-start gap-x-4 overflow-auto'>
            {R.sum(Object.values(recordsSummaryRes.data.JPY)) > 0 && (
              <div className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'>
                <Heading level={2}>JPY</Heading>
                <RecordSummary report={recordsSummaryRes.data.JPY} />
              </div>
            )}
            {R.sum(Object.values(recordsSummaryRes.data.TWD)) > 0 && (
              <div className='rounded-lg border border-zinc-950/5 p-4 dark:border-white/5'>
                <Heading level={2}>TWD</Heading>
                <RecordSummary report={recordsSummaryRes.data.TWD} />
              </div>
            )}
          </section>

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
            title={
              submitPaymentRecordRes.data.type ===
              RECORD_TYPE.enum('PayYahooAuctionFeeType')
                ? '支付日拍手續費'
                : submitPaymentRecordRes.data.type ===
                    RECORD_TYPE.enum('PayAuctionItemCancellationFeeType')
                  ? '支付日拍取消手續費'
                  : '發生錯誤'
            }
            recordId={submitPaymentRecordRes.data.id}
            amount={
              submitPaymentRecordRes.data.type ===
              RECORD_TYPE.enum('PayYahooAuctionFeeType')
                ? submitPaymentRecordRes.data.yahooAuctionFee
                : submitPaymentRecordRes.data.type ===
                    RECORD_TYPE.enum('PayAuctionItemCancellationFeeType')
                  ? submitPaymentRecordRes.data.yahooCancellationFee
                  : undefined
            }
            bankName={configsRes.data.bankName}
            bankCode={configsRes.data.bankCode}
            bankAccount={configsRes.data.bankAccount}
          />
        )}
    </div>
  )
}

function RecordSummary({ report }: { report: RecordSummary }) {
  return (
    <Table dense>
      {/* v4 https://docs.google.com/spreadsheets/d/1S2-9S-AOAJG5a_hHFlA1N6YN1W5LZjpZzptL2UgBj5w/edit?usp=sharing */}
      <TableBody className='[&>tr>td:last-child]:text-end'>
        {report.totalJpyWithdrawal != 0 && (
          <TableRow>
            <TableCell>總提款日幣</TableCell>
            <TableCell>{report.totalJpyWithdrawal.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalWithdrawal != 0 && (
          <TableRow>
            <TableCell>總提款台幣</TableCell>
            <TableCell>{report.totalWithdrawal.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalPrice != 0 && (
          <TableRow>
            <TableCell>總結算金額</TableCell>
            <TableCell>{report.totalPrice.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalDirectPurchasePrice != 0 && (
          <TableRow>
            <TableCell>總直購金額</TableCell>
            <TableCell>{report.totalDirectPurchasePrice.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalPurchasedPrice != 0 && (
          <TableRow>
            <TableCell>總買回金額</TableCell>
            <TableCell>{report.totalPurchasedPrice.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalYahooAuctionFee != 0 && (
          <TableRow>
            <TableCell>總日拍手續費</TableCell>
            <TableCell>{report.totalYahooAuctionFee.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalCommission != 0 && (
          <TableRow>
            <TableCell>總平台手續費</TableCell>
            <TableCell>{report.totalCommission.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalBonus != 0 && (
          <TableRow>
            <TableCell>總回饋金額</TableCell>
            <TableCell>{report.totalBonus.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalProfit != 0 && (
          <TableRow>
            <TableCell>總收益</TableCell>
            <TableCell>{report.totalProfit.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalYahooCancellationFee != 0 && (
          <TableRow>
            <TableCell>總日拍取消手續費</TableCell>
            <TableCell>{report.totalYahooCancellationFee.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalSpaceFee != 0 && (
          <TableRow>
            <TableCell>總留倉費</TableCell>
            <TableCell>{report.totalSpaceFee.toLocaleString()}</TableCell>
          </TableRow>
        )}
        {report.totalShippingCost != 0 && (
          <TableRow>
            <TableCell>總運費</TableCell>
            <TableCell>{report.totalShippingCost.toLocaleString()}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
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

                {row.status === RECORD_STATUS.enum('UnpaidStatus') && (
                  <div className='mt-2 flex justify-center gap-x-2'>
                    {row.type === RECORD_TYPE.enum('PayYahooAuctionFeeType') && (
                      <SubmitPayment
                        title='支付日拍手續費'
                        recordId={row.id}
                        amount={row.yahooAuctionFee}
                        bankName={configs.bankName}
                        bankAccount={configs.bankAccount}
                        bankCode={configs.bankCode}
                      />
                    )}
                    {row.type ===
                      RECORD_TYPE.enum('PayAuctionItemCancellationFeeType') && (
                      <SubmitPayment
                        title='支付日拍取消手續費'
                        recordId={row.id}
                        amount={row.yahooCancellationFee}
                        bankName={configs.bankName}
                        bankAccount={configs.bankAccount}
                        bankCode={configs.bankCode}
                      />
                    )}
                    <CancelPayment recordID={row.id} />
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
                          {currencySign('JPY')}
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
