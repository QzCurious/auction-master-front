import { GetFrontendConfigs } from '@/app/api/frontend/GetFrontendConfigs'
import {
  ITEM_STATUS_DATA,
  ITEM_STATUS_KEY_MAP,
  ITEM_STATUS_MAP,
  ITEM_TYPE_DATA,
  ITEM_TYPE_KEY_MAP,
  ITEM_TYPE_MAP,
} from '@/app/api/frontend/GetFrontendConfigs.data'
import { GetConsignorItem } from '@/app/api/frontend/items/GetConsignorItem'
import { getExchangeRate } from '@/app/api/getExchangeRate'
import { getUser } from '@/app/api/helpers/getUser'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/app/catalyst-ui/description-list'
import { Subheading } from '@/app/catalyst-ui/heading'
import RedirectToHome from '@/app/RedirectToHome'
import { StatusFlow } from '@/app/StatusFlow'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import 'quill/dist/quill.snow.css'
import ItemForm from '../../ItemForm'
import ConsignmentApprovedStatusAlert from './ConsignmentApprovedStatusAlert'
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
  const [user, itemRes, configsRes] = await Promise.all([
    getUser(),
    GetConsignorItem(id),
    GetFrontendConfigs(),
  ])

  if (!user) {
    return <RedirectToHome />
  }

  if (configsRes.error === '1003' || itemRes.error === '1003') {
    return <RedirectToHome />
  }

  if (itemRes.error === '1801') {
    notFound()
  }

  const yenToNtdRate = await getExchangeRate('JPY', 'NTD')

  if (itemRes.data.status === ITEM_STATUS_MAP.SubmitAppraisalStatus) {
    return <ItemForm item={itemRes.data} yenToNtdRate={yenToNtdRate} />
  }

  return (
    <>
      {itemRes.data.status === ITEM_STATUS_MAP.ConsignmentApprovedStatus && (
        <div className='mb-6'>
          <ConsignmentApprovedStatusAlert
            configs={configsRes.data}
            item={itemRes.data}
          />
        </div>
      )}

      <div className='flex flex-col gap-x-10 gap-y-8 sm:flex-row'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-x-6 sm:justify-start'>
            <h1 className='text-2xl font-bold text-gray-900'>{itemRes.data.name}</h1>
            <p className='inline-flex flex-none cursor-default items-center rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-800 ring-1 ring-inset ring-gray-500/10'>
              {
                ITEM_STATUS_DATA.find(({ value }) => value === itemRes.data.status)
                  ?.message
              }
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
            <DescriptionList className=''>
              <DescriptionTerm>類別</DescriptionTerm>
              <DescriptionDetails>
                {ITEM_TYPE_DATA.find(({ value }) => value === itemRes.data.type)
                  ?.message ?? '(待定)'}
              </DescriptionDetails>

              <DescriptionTerm>佔用空間</DescriptionTerm>
              <DescriptionDetails>{itemRes.data.space}</DescriptionDetails>

              <DescriptionTerm>期望金額</DescriptionTerm>
              <DescriptionDetails className='text-end'>
                ¥ {itemRes.data.reservePrice.toLocaleString()}
                <p className='whitespace-nowrap text-zinc-500'>
                  (約{' '}
                  {Math.floor(
                    itemRes.data.reservePrice * yenToNtdRate,
                  ).toLocaleString()}{' '}
                  台幣)
                </p>
              </DescriptionDetails>

              {(itemRes.data.status === ITEM_STATUS_MAP.AppraisedStatus ||
                (itemRes.data.type === ITEM_TYPE_MAP.CompanyDirectPurchaseType &&
                  StatusFlow.flow[
                    ITEM_STATUS_KEY_MAP[itemRes.data.status]
                  ].allowTypes.some(
                    (t) =>
                      itemRes.data.type === 0 ||
                      t === ITEM_TYPE_KEY_MAP[itemRes.data.type],
                  ))) && (
                <>
                  <DescriptionTerm>現金收購金額</DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    ¥ {itemRes.data.directPurchasePrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約{' '}
                      {Math.floor(
                        itemRes.data.directPurchasePrice * yenToNtdRate,
                      ).toLocaleString()}{' '}
                      台幣)
                    </p>
                  </DescriptionDetails>
                </>
              )}

              {itemRes.data.type === ITEM_TYPE_MAP['AppraisableAuctionItemType'] && (
                <>
                  <DescriptionTerm>最低估值</DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    ¥ {itemRes.data.minEstimatedPrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約{' '}
                      {Math.floor(
                        itemRes.data.minEstimatedPrice * yenToNtdRate,
                      ).toLocaleString()}{' '}
                      台幣)
                    </p>
                  </DescriptionDetails>

                  <DescriptionTerm>最高估值</DescriptionTerm>
                  <DescriptionDetails className='text-end'>
                    ¥ {itemRes.data.maxEstimatedPrice.toLocaleString()}
                    <p className='whitespace-nowrap text-zinc-500'>
                      (約{' '}
                      {Math.floor(
                        itemRes.data.maxEstimatedPrice * yenToNtdRate,
                      ).toLocaleString()}{' '}
                      台幣)
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
