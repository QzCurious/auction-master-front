import { GetConfigs } from '@/app/api/frontend/GetConfigs'
import { GetJPYRates } from '@/app/api/frontend/GetJPYRates'
import { GetConsignorItem } from '@/app/api/frontend/items/GetConsignorItem'
import { ITEM_STATUS, ITEM_TYPE } from '@/app/api/frontend/static-configs.data'
import { GetConsignorWalletBalance } from '@/app/api/frontend/wallets/GetConsignorWalletBalance'
import { getUser } from '@/app/api/helpers/getUser'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/app/catalyst-ui/description-list'
import { Subheading } from '@/app/catalyst-ui/heading'
import InfoPopover, { InfoPopoverPanel } from '@/app/components/InfoPopover'
import RedirectToHome from '@/app/RedirectToHome'
import { currencySign } from '@/app/static'
import { StatusFlow } from '@/app/StatusFlow'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as R from 'remeda'
import ItemForm from '../../ItemForm'
import ConsignmentApprovedStatusAlert from './ConsignmentApprovedStatusAlert'
import PaySpaceFeeAlert from './PaySpaceFeeAlert'
import PhotoListForm from './PhotoListForm'
import { StatusFlowUI } from './StatusFlowSection'

const QuillTextEditor = dynamic(
  () => import('@/app/components/QuillTextEditor/QuillTextEditor'),
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
  const [user, itemRes, configsRes, jpyRatesRes] = await Promise.all([
    getUser(),
    GetConsignorItem(id),
    GetConfigs(),
    GetJPYRates(),
  ])

  if (!user) {
    return <RedirectToHome />
  }

  if (
    configsRes.error === '1003' ||
    itemRes.error === '1003' ||
    jpyRatesRes.error === '1003'
  ) {
    return <RedirectToHome />
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

      {(async function iife() {
        const balanceRes = await GetConsignorWalletBalance()

        if (balanceRes.error === '1003') {
          return <RedirectToHome />
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
            <Subheading level={2}>物品進度</Subheading>
            <div className='mt-3'>
              <StatusFlowUI item={itemRes.data} user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
