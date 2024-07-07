import RedirectToHome from '@/app/RedirectToHome'
import {
  ITEM_STATUS_DATA,
  ITEM_TYPE_DATA,
  ITEM_TYPE_MAP,
} from '@/app/api/frontend/configs.data'
import { getItem } from '@/app/api/frontend/items/getItem'
import { getUser } from '@/app/api/helpers/getUser'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from '@/app/catalyst-ui/description-list'
import { Subheading } from '@/app/catalyst-ui/heading'
import ClientOnly from '@/app/components/ClientOnly'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import 'quill/dist/quill.snow.css'
import QuillTextEditor from '../../../../components/QuillTextEditor/QuillTextEditor'
import PhotoListForm from './PhotoListForm'
import { StatusFlowUI } from './StatusFlowSection'

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
  const user = await getUser()
  if (!user) {
    return <RedirectToHome />
  }

  const id = Number(params.id)
  if (isNaN(id)) {
    notFound()
  }

  const item = await getItem(id)
  if (item.error === '1003') {
    return <RedirectToHome />
  }
  if (item.error === '1801') {
    notFound()
  }

  return (
    <>
      <div className='flex flex-col gap-x-10 gap-y-8 sm:flex-row'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-x-6 sm:justify-start'>
            <h1 className='text-2xl font-bold text-gray-900'>{item.data.name}</h1>
            <p className='inline-flex flex-none cursor-default items-center rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-800 ring-1 ring-inset ring-gray-500/10'>
              {
                ITEM_STATUS_DATA.find(({ value }) => value === item.data.status)
                  ?.message
              }
            </p>
          </div>

          <div className='mt-4'>
            <PhotoListForm item={item.data} />
          </div>

          <section className='mt-8 text-gray-700'>
            <Subheading level={2}>描述</Subheading>
            {item.data.description ? (
              <div className='mt-2'>
                <ClientOnly>
                  <QuillTextEditor
                    readOnly
                    hideToolbar
                    defaultValue={item.data.description}
                  />
                </ClientOnly>
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
                {ITEM_TYPE_DATA.find(({ value }) => value === item.data.type)
                  ?.message ?? '(待定)'}
              </DescriptionDetails>

              <DescriptionTerm>空間</DescriptionTerm>
              <DescriptionDetails>{item.data.space}</DescriptionDetails>

              <DescriptionTerm>期望金額</DescriptionTerm>
              <DescriptionDetails>
                {item.data.reservePrice.toLocaleString()}
              </DescriptionDetails>

              {item.data.type === ITEM_TYPE_MAP['AppraisableAuctionItemType'] && (
                <>
                  <DescriptionTerm>最低估值</DescriptionTerm>
                  <DescriptionDetails>
                    {item.data.minEstimatedPrice.toLocaleString()}
                  </DescriptionDetails>

                  <DescriptionTerm>最高估值</DescriptionTerm>
                  <DescriptionDetails>
                    {item.data.maxEstimatedPrice.toLocaleString()}
                  </DescriptionDetails>
                </>
              )}
            </DescriptionList>
          </section>

          <div className='mt-10'>
            <Subheading level={2}>狀態流程</Subheading>
            <div className='mt-3'>
              <StatusFlowUI item={item.data} user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
