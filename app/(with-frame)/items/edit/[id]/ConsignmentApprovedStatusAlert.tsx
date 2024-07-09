'use client'

import { Configs } from '@/app/api/frontend/configs'
import { ITEM_STATUS_MESSAGE_MAP } from '@/app/api/frontend/configs.data'
import { Item } from '@/app/api/frontend/items/getItem'
import { itemShipped } from '@/app/api/frontend/items/itemShipped'
import { Button } from '@/app/catalyst-ui/button'
import { Select } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { ChevronUpDownIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import 'quill/dist/quill.snow.css'
import { useState, useTransition } from 'react'

export default function ConsignmentApprovedStatusAlert({
  configs,
  item,
}: {
  configs: Configs
  item: Item
}) {
  const [value, setValue] = useState<'company' | 'sevenEleven' | 'family'>('company')
  const [isPending, startTransition] = useTransition()

  return (
    <div className='rounded-md bg-blue-50 p-4 sm:text-sm'>
      <div className='flex shrink-0 items-center gap-x-3'>
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
          <p className='leading-tight'>
            請將物品寄送至我司以完成後續寄售程序，並在
            <span className='rounded-sm bg-yellow-100 px-0.5 font-semibold'>
              寄送外箱上填寫 ID: {item.id}
            </span>
            ，供我們快速辨識您的物品
          </p>

          <div className='mt-4 sm:mt-2'></div>

          <div className='flex w-fit flex-wrap gap-x-6 gap-y-4'>
            <table>
              <tbody className='[&_td]:py-0.5 first-of-type:[&_td]:pr-2'>
                <tr>
                  <td>寄送方式:</td>
                  <td>
                    <div className='relative inline-block rounded-sm border-b border-dashed border-blue-600 hover:border-blue-800 hover:bg-blue-100'>
                      <Select
                        className='appearance-none bg-transparent pr-3.5'
                        value={value}
                        onChange={(e) => setValue(e.target.value as typeof value)}
                      >
                        <option value='company'>公司寄送或親送</option>
                        <option value='sevenEleven'>7-11</option>
                        <option value='family'>全家</option>
                      </Select>
                      <ChevronUpDownIcon
                        className='pointer-events-none absolute bottom-0 right-0 top-px my-auto inline-block size-3.5 stroke-2'
                        aria-hidden='true'
                      />
                    </div>
                  </td>
                </tr>

                {value === 'company' ? (
                  <>
                    <tr>
                      <td>寄送地址:</td>
                      <td>
                        {configs.shippingInfo[value].address}
                        <CopyBtn text={configs.shippingInfo[value].address} />
                      </td>
                    </tr>
                    <tr>
                      <td>聯絡人姓名:</td>
                      <td>
                        {configs.shippingInfo[value].recipientName}
                        <CopyBtn text={configs.shippingInfo[value].recipientName} />
                      </td>
                    </tr>
                    <tr>
                      <td>聯絡電話:</td>
                      <td>
                        {configs.shippingInfo[value].phone}
                        <CopyBtn text={configs.shippingInfo[value].phone} />
                      </td>
                    </tr>
                  </>
                ) : value === 'sevenEleven' || value === 'family' ? (
                  <>
                    <tr>
                      <td>聯絡人姓名:</td>
                      <td>
                        {configs.shippingInfo[value].recipientName}
                        <CopyBtn text={configs.shippingInfo[value].recipientName} />
                      </td>
                    </tr>
                    <tr>
                      <td>聯絡電話:</td>
                      <td>
                        {configs.shippingInfo[value].phone}
                        <CopyBtn text={configs.shippingInfo[value].phone} />
                      </td>
                    </tr>
                    <tr>
                      <td>取件門市:</td>
                      <td>
                        {configs.shippingInfo[value].storeName}
                        <CopyBtn text={configs.shippingInfo[value].storeName} />
                      </td>
                    </tr>
                    <tr>
                      <td>取件門市代號:</td>
                      <td>
                        {configs.shippingInfo[value].storeNumber}
                        <CopyBtn text={configs.shippingInfo[value].storeNumber} />
                      </td>
                    </tr>
                  </>
                ) : null}
              </tbody>
            </table>

            <div className='ml-auto self-end'>
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

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function CopyBtn({ text }: { text: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      className='ml-1'
      onClick={() =>
        startTransition(async () => {
          copy(text)
          await delay(1000)
        })
      }
    >
      <span className='sr-only'>複製文字: {text}</span>
      <DocumentDuplicateIcon
        className={clsx(
          '-mb-0.5 h-3.5 w-3.5',
          isPending && 'fill-current stroke-blue-100',
        )}
      />
    </button>
  )
}
