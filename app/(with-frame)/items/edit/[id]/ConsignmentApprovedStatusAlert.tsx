'use client'

import { Configs } from '@/app/api/frontend/configs'
import { ITEM_STATUS_MESSAGE_MAP } from '@/app/api/frontend/configs.data'
import { Item } from '@/app/api/frontend/items/getItem'
import { itemShipped } from '@/app/api/frontend/items/itemShipped'
import { Button } from '@/app/catalyst-ui/button'
import { Field, Label, Select } from '@headlessui/react'
import { ChevronUpDownIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import 'quill/dist/quill.snow.css'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'

export default function ConsignmentApprovedStatusAlert({
  configs,
  item,
}: {
  configs: Configs
  item: Item
}) {
  const [value, setValue] = useState<'company' | 'sevenEleven' | 'family'>(
    'sevenEleven',
  )
  const [isPending, startTransition] = useTransition()

  return (
    <div className='rounded-md bg-blue-50 p-4 sm:text-sm'>
      <div className='flex shrink-0 gap-x-3 items-center'>
        <InformationCircleIcon
          aria-hidden='true'
          className='h-5 w-5 shrink-0 text-blue-400'
        />
        <h3 className='font-medium text-blue-800'>
          {ITEM_STATUS_MESSAGE_MAP.ConsignmentApprovedStatus}
        </h3>
      </div>

      <div className='ml-8 mt-2 w-fit'>
        <div className='text-blue-800'>
          <p className='leading-tight'>請將物品寄送至我司以完成後續寄售程序</p>

          <div className='mt-2'></div>

          <div className='flex flex-wrap gap-x-6 gap-y-4'>
            <div className='space-y-1'>
              <Field>
                <Label className='inline-block min-w-28'>寄送方式:</Label>
                <div className='relative mx-px inline-block rounded-sm border-b border-dashed border-blue-600 hover:border-blue-800 hover:bg-blue-100'>
                  <Select
                    className='appearance-none bg-transparent pl-0.5 pr-3.5'
                    onChange={(e) => setValue(e.target.value as typeof value)}
                  >
                    <option value='company'>公司寄送</option>
                    <option value='sevenEleven'>7-11寄貨便</option>
                    <option value='family'>全家店到店</option>
                  </Select>
                  <ChevronUpDownIcon
                    className='pointer-events-none absolute bottom-0 right-0 top-px my-auto inline-block size-3.5'
                    aria-hidden='true'
                  />
                </div>
              </Field>

              {(value === 'sevenEleven' || value === 'family') && (
                <>
                  <p>
                    <span className='inline-block min-w-28'>取件者姓名:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].recipientName}
                    </span>
                  </p>
                  <p>
                    <span className='inline-block min-w-28'>取件者電話:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].phone}
                    </span>
                  </p>
                  <p>
                    <span className='inline-block min-w-28'>取件門市:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].storeName}
                    </span>
                  </p>
                  <p>
                    <span className='inline-block min-w-28'>取件門市代號:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].storeNumber}
                    </span>
                  </p>
                </>
              )}
              {value === 'company' && (
                <>
                  <p>
                    <span className='inline-block min-w-28'>寄送地址:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].address}
                    </span>
                  </p>
                  <p>
                    <span className='inline-block min-w-28'>聯絡人姓名:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].recipientName}
                    </span>
                  </p>
                  <p>
                    <span className='inline-block min-w-28'>聯絡電話:</span>{' '}
                    <span className='font-semibold'>
                      {configs.shippingInfo[value].phone}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className='self-end ml-auto'>
              <Button
                type='button'
                loading={isPending}
                className=''
                color='indigo'
                onClick={() => {
                  startTransition(() => {
                    itemShipped(item.id)
                  })
                }}
              >
                物品寄送完成
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
