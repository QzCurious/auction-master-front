import { GetConfigs } from '@/api/frontend/GetConfigs'
import { GetJPYRates } from '@/api/frontend/GetJPYRates'
import { GetConsignorItem } from '@/api/frontend/items/GetConsignorItem'
import { GetRecord } from '@/api/frontend/reports/GetRecord'
import { GetConsignorWalletBalance } from '@/api/frontend/wallets/GetConsignorWalletBalance'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/catalyst-ui/description-list'
import { Subheading } from '@/catalyst-ui/heading'
import InfoPopover, { InfoPopoverPanel } from '@/components/InfoPopover'
import RedirectAuthError from '@/domain/auth/RedirectAuthError'
import { currencySign, DATE_FORMAT, SITE_NAME } from '@/domain/static/static'
import {
  ITEM_STATUS,
  ITEM_TYPE,
  RECORD_STATUS,
} from '@/domain/static/static-config-mappers'
import { StatusFlow } from '@/domain/static/StatusFlow'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as R from 'remeda'
import ItemForm from '../../ItemForm'
import ConsignmentApprovedStatusAlert from './ConsignmentApprovedStatusAlert'
import PaySpaceFeeAlert from './PaySpaceFeeAlert'
import PhotoListForm from './PhotoListForm'
import ReturnItemDialog from './ReturnItemDialog'
import { StatusFlowUI } from './StatusFlowSection'

export const metadata = { title: `編輯物品 | ${SITE_NAME}` } satisfies Metadata

const QuillTextEditor = dynamic(
  () => import('@/components/QuillTextEditor/QuillTextEditor'),
  { ssr: false },
)

interface PageProps {
  params: { id: string }
}

async function Page(pageProps: PageProps) {
  return (
    <div className='mx-auto max-w-4xl px-8'>
      <Link
        className='inline-flex items-center gap-x-1 text-sm text-indigo-600 hover:text-indigo-500'
        href='/items'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        回到物品列表
      </Link>

      <div className='mt-4'>
        <Content {...pageProps} />
      </div>
    </div>
  )
}

export default Page

async function Content({ params }: PageProps) {
  const id = Number(params.id)
  if (isNaN(id)) {
    notFound()
  }
  const [itemRes, configsRes, jpyRatesRes] = await Promise.all([
    GetConsignorItem(id),
    GetConfigs(),
    GetJPYRates(),
  ])

  if (
    configsRes.error === '1003' ||
    itemRes.error === '1003' ||
    jpyRatesRes.error === '1003'
  ) {
    return <RedirectAuthError />
  }

  if (itemRes.error === '1801') {
    notFound()
  }

  if (itemRes.data.status === ITEM_STATUS.enum('SubmitAppraisalStatus')) {
    return <ItemForm item={itemRes.data} jpyBuyingRate={jpyRatesRes.data.buying} />
  }

  const flowPath = StatusFlow.flowPath({
    from: 'SubmitAppraisalStatus',
    to: ITEM_STATUS.enum(itemRes.data.status),
    type: itemRes.data.type ? ITEM_TYPE.enum(itemRes.data.type) : null,
    withFuture: true,
  })

  function flowMightOfType(type: ITEM_TYPE['key']) {
    const i = itemRes.data
      ? flowPath.indexOf(ITEM_STATUS.enum(itemRes.data.status))
      : -1
    const isTypeDecided = i <= flowPath.indexOf('AppraisedStatus')

    if (isTypeDecided) return true

    return itemRes.data?.type === ITEM_TYPE.enum(type)
  }

  return (
    <>
      {R.isIncludedIn(itemRes.data.status, [
        ITEM_STATUS.enum('ConsignmentApprovedStatus'),
        ITEM_STATUS.enum('ConsignorChoosesCompanyDirectPurchaseStatus'),
      ]) && (
        <div className='mb-6'>
          <ConsignmentApprovedStatusAlert
            configs={configsRes.data}
            item={itemRes.data}
          />
        </div>
      )}

      {itemRes.data.status === ITEM_STATUS.enum('WarehouseReturnPendingStatus') && (
        <section className='mb-6 rounded-md bg-blue-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <InformationCircleIcon
                aria-hidden='true'
                className='h-5 w-5 text-blue-400'
              />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                {ITEM_STATUS.get('value', itemRes.data.status).message}
              </h3>
              <div className='mt-2 text-sm text-blue-800'>
                <p>請聯繫客服已完成後續退貨手續</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {(async function iife() {
        if (itemRes.data.status !== ITEM_STATUS.enum('WarehouseReturningStatus')) {
          return
        }

        if (!itemRes.data.recordId) {
          return
        }

        const recordRes = await GetRecord(itemRes.data.recordId)
        if (recordRes.error === '1003') {
          return <RedirectAuthError />
        }

        return (
          <section className='mb-6 rounded-md bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon
                  aria-hidden='true'
                  className='h-5 w-5 text-blue-400'
                />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-blue-800'>
                  {ITEM_STATUS.get('value', itemRes.data.status).message}
                </h3>
                <div className='mt-2 text-sm text-blue-800'>
                  {recordRes.data.status === RECORD_STATUS.enum('UnpaidStatus') && (
                    <p>
                      已確認退貨申請，請
                      <Link
                        className='text-indigo-600 underline underline-offset-2 hover:text-indigo-500'
                        href={`/records?submit-payment=${itemRes.data.recordId}`}
                      >
                        點此取得匯款資訊
                      </Link>
                      並完成匯款
                    </p>
                  )}
                  {recordRes.data.status ===
                    RECORD_STATUS.enum('SubmitPaymentStatus') && (
                    <p>您已確認完成匯款，我們將儘速確認您的付款狀態，請耐心等候</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })()}

      {(async function iife() {
        if (!itemRes.data.expireAt) return
        if (new Date(itemRes.data.expireAt) > new Date()) return

        if (itemRes.data.recordId) {
          const recordRes = await GetRecord(itemRes.data.recordId)
          if (recordRes.error === '1003') {
            return <RedirectAuthError />
          }

          return (
            <div className='mb-6'>
              <section className='rounded-md bg-blue-50 p-4 sm:text-sm'>
                <div className='flex shrink-0 items-center gap-x-3'>
                  <InformationCircleIcon
                    aria-hidden='true'
                    className='h-5 w-5 shrink-0 text-blue-400'
                  />
                  <h3 className='font-medium text-blue-800'>待繳留倉費</h3>
                </div>

                <div className='ml-8 mt-2'>
                  <div className='text-blue-800'>
                    <div className='mt-4 sm:mt-2'></div>

                    <ul className='list-inside list-disc space-y-1'>
                      <li className='leading-tight'>
                        您的物品已於 {format(itemRes.data.expireAt, DATE_FORMAT)}{' '}
                        超過留倉期限，請繳清留倉費
                      </li>
                      {recordRes.data.status ===
                        RECORD_STATUS.enum('UnpaidStatus') && (
                        <li>
                          您已申請匯款支付，請
                          <Link
                            className='text-indigo-600 underline underline-offset-2 hover:text-indigo-500'
                            href={`/records?submit-payment=${itemRes.data.recordId}`}
                          >
                            點此取得匯款資訊
                          </Link>
                          並完成匯款
                        </li>
                      )}
                      {recordRes.data.status ===
                        RECORD_STATUS.enum('SubmitPaymentStatus') && (
                        <li>
                          您已確認完成匯款，我們將儘速確認您的付款狀態，請耐心等候
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )
        }

        const balanceRes = await GetConsignorWalletBalance()

        if (balanceRes.error === '1003') {
          return <RedirectAuthError />
        }

        return (
          <div className='mb-6'>
            <PaySpaceFeeAlert
              configs={configsRes.data}
              walletBalance={balanceRes.data}
              jpyExchangeRate={jpyRatesRes.data}
              item={itemRes.data}
            />
          </div>
        )
      })()}

      <div className='flex flex-col gap-x-10 gap-y-8 sm:flex-row'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-x-6 sm:justify-start'>
            <h1 className='text-2xl font-bold text-gray-900'>{itemRes.data.name}</h1>
            <p className='inline-flex flex-none cursor-default items-center rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-800 ring-1 ring-inset ring-gray-500/10'>
              {ITEM_STATUS.get('value', itemRes.data.status).message}
            </p>
          </div>

          <div className='mt-4'>
            <PhotoListForm item={itemRes.data} />
          </div>

          <section className='mt-8 text-gray-700'>
            <Subheading level={2}>描述</Subheading>
            {itemRes.data.description ? (
              <div className='mt-2'>
                <QuillTextEditor
                  readOnly
                  hideToolbar
                  defaultValue={itemRes.data.description}
                />
              </div>
            ) : (
              <div className='mt-2'>暫無描述</div>
            )}
          </section>
        </div>

        <div className='min-w-40'>
          <section>
            <DescriptionList className='whitespace-nowrap'>
              <DescriptionTerm>類別</DescriptionTerm>
              <DescriptionDetails>
                {ITEM_TYPE.data.find(({ value }) => value === itemRes.data.type)
                  ?.message ?? '(待定)'}
              </DescriptionDetails>

              {!!StatusFlow.flowPath({
                from: 'WarehousePersonnelConfirmedStatus',
                to: ITEM_STATUS.enum(itemRes.data.status),
                type: itemRes.data.type ? ITEM_TYPE.enum(itemRes.data.type) : null,
                withFuture: false,
              }).length && (
                <>
                  <DescriptionTerm>佔用空間</DescriptionTerm>
                  <DescriptionDetails>{itemRes.data.space}</DescriptionDetails>
                </>
              )}

              <DescriptionTerm>
                期望金額
                <InfoPopover>
                  <InfoPopoverPanel>
                    物品上架競拍期望最低售出之價格；若競拍價格低於期望金額，公司將自動拍下此物品並安排下一次競拍
                  </InfoPopoverPanel>
                </InfoPopover>
              </DescriptionTerm>
              <DescriptionDetails className='text-end'>
                {currencySign('JPY')}
                {itemRes.data.reservePrice.toLocaleString()}
                <p className='whitespace-nowrap text-zinc-500'>
                  (約 {currencySign('TWD')}
                  {Math.floor(
                    itemRes.data.reservePrice * jpyRatesRes.data.buying,
                  ).toLocaleString()}
                  )
                </p>
              </DescriptionDetails>

              {flowMightOfType('CompanyDirectPurchaseType') && (
                <>
                  <DescriptionTerm>
                    收購金額
                    <InfoPopover>
                      <InfoPopoverPanel>
                        本金額是由本公司直接以該現金價直接收購您的商品，物品收到後檢查沒問題後立即匯款
                      </InfoPopoverPanel>
                    </InfoPopover>
                  </DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    {currencySign('JPY')}
                    {itemRes.data.directPurchasePrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約 {currencySign('TWD')}
                      {Math.floor(
                        itemRes.data.directPurchasePrice * jpyRatesRes.data.buying,
                      ).toLocaleString()}
                      )
                    </p>
                  </DescriptionDetails>
                </>
              )}

              {itemRes.data.type === ITEM_TYPE.enum('AppraisableAuctionItemType') && (
                <>
                  <DescriptionTerm>
                    最低估值
                    <InfoPopover>
                      <InfoPopoverPanel>
                        經由鑑價師評估此物品可能被拍出的最低價格
                      </InfoPopoverPanel>
                    </InfoPopover>
                  </DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    {currencySign('JPY')}
                    {itemRes.data.minEstimatedPrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約 {currencySign('TWD')}
                      {Math.floor(
                        itemRes.data.minEstimatedPrice * jpyRatesRes.data.buying,
                      ).toLocaleString()}
                      )
                    </p>
                  </DescriptionDetails>

                  <DescriptionTerm>
                    最高估值
                    <InfoPopover>
                      <InfoPopoverPanel>
                        經由鑑價師評估此物品可能被拍出的最高價格
                      </InfoPopoverPanel>
                    </InfoPopover>
                  </DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    {currencySign('JPY')}
                    {itemRes.data.maxEstimatedPrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約 {currencySign('TWD')}
                      {Math.floor(
                        itemRes.data.maxEstimatedPrice * jpyRatesRes.data.buying,
                      ).toLocaleString()}
                      )
                    </p>
                  </DescriptionDetails>
                </>
              )}
            </DescriptionList>
          </section>

          <div className='mt-10'>
            {R.isIncludedIn(itemRes.data.status, [
              ITEM_STATUS.enum('WarehouseArrivalStatus'),
              ITEM_STATUS.enum('WarehousePersonnelConfirmedStatus'),
              ITEM_STATUS.enum('AppraiserConfirmedStatus'),
              ITEM_STATUS.enum('ConsignorConfirmedStatus'),
            ]) && (
              <div className='mb-4 flex justify-end'>
                <ReturnItemDialog item={itemRes.data} />
              </div>
            )}

            <Subheading level={2}>物品進度</Subheading>
            <div className='mt-3'>
              <StatusFlowUI item={itemRes.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
