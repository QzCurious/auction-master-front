'use client'

import { Consignor } from '@/api/frontend/consignor/GetConsignor'
import { UpdateConsignorAvatar } from '@/api/frontend/consignor/UpdateConsignorAvatar'
import { Configs } from '@/api/frontend/GetConfigs'
import { Button } from '@/catalyst-ui/button'
import { useHandleApiError } from '@/domain/api/HandleApiError'
import { toPercent } from '@/domain/static/static'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z.object({
  avatarPhoto: z.union([z.string(), z.instanceof(File)]).nullable(),
})

export default function AccountInfoForm({
  consignor,
  configs,
}: {
  consignor: Consignor
  configs: Configs
}) {
  const [isPending, startTransition] = useTransition()
  const [conformingDelete, setConformingDelete] = useState(false)
  const handleApiError = useHandleApiError()

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>個人資訊</h2>
      </div>

      <div className='md:col-span-2'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          {/* {!consignor.lineId && (
            <div className='sm:col-span-full'>
              <div className='mb-4 rounded-md bg-blue-50 p-4'>
                <div className='flex'>
                  <div className='shrink-0'>
                    <InformationCircleIcon
                      aria-hidden='true'
                      className='size-5 text-blue-400'
                    />
                  </div>
                  <div className='ml-3 flex-1 md:flex md:justify-between'>
                    <p className='text-sm text-blue-700'>
                      加入
                      <a
                        href={configs.lineURL}
                        className='text-link mx-1 inline-flex items-center'
                      >
                        官方LINE
                        <ArrowTopRightOnSquareIcon className='ml-0.5 inline-block h-4 w-4' />
                      </a>
                      並綁定通知已獲得物品即時更新資訊
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          <div className='flex items-center gap-x-8 sm:col-span-full'>
            <div className='group relative'>
              <div
                className={clsx(
                  'pointer-events-none absolute inset-0 z-10 transition-colors group-hover:bg-white/20',
                  isPending && 'animate-pulse bg-white/50',
                )}
                aria-hidden='true'
              />

              {consignor.avatar ? (
                <div className='group relative size-24 flex-none'>
                  <label htmlFor='avatarPhoto' className='block size-full'>
                    <img
                      src={consignor.avatar}
                      className='size-full rounded-lg bg-gray-800 object-cover object-center'
                      width={96}
                      height={96}
                      alt=''
                    />
                  </label>
                  {conformingDelete ? (
                    <div className='absolute bottom-0 left-0 right-0 top-0 grid place-content-center'>
                      <Button
                        type='button'
                        color='red'
                        autoFocus
                        onBlur={() => setConformingDelete(false)}
                        onClick={() => {
                          startTransition(async () => {
                            const formData = new FormData()
                            formData.append('avatarPhoto', '')
                            const res = await UpdateConsignorAvatar(formData)
                            if (res.error) {
                              handleApiError(res.error)
                              return
                            }

                            toast.success('頭像刪除成功')
                            setConformingDelete(false)
                          })
                        }}
                      >
                        確認刪除
                      </Button>
                    </div>
                  ) : (
                    <button
                      type='button'
                      className='absolute -right-1.5 -top-1.5 bottom-auto left-auto hidden size-6 cursor-pointer rounded-full bg-red-500 p-0.5 text-white hover:bg-red-400 group-hover:block'
                      onClick={() => setConformingDelete(true)}
                    >
                      <span className='sr-only'>刪除</span>
                      <XMarkIcon />
                    </button>
                  )}
                </div>
              ) : (
                <label
                  htmlFor='avatarPhoto'
                  className='block size-24 flex-none overflow-hidden rounded-lg border'
                >
                  <svg
                    className='size-full text-gray-300'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                </label>
              )}
              <input
                type='file'
                className='sr-only'
                id='avatarPhoto'
                name='avatarPhoto'
                accept='image/png, image/jpeg, image/jpg, image/gif'
                onChange={(e) => {
                  startTransition(async () => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const formData = new FormData()
                    formData.append('avatarPhoto', file)
                    const res = await UpdateConsignorAvatar(formData)
                    if (res.error) {
                      handleApiError(res.error)
                      return
                    }

                    toast.success('更新成功')
                  })
                }}
              />
            </div>

            <div>
              <Button
                type='button'
                outline
                onClick={() => document.getElementById('avatarPhoto')?.click()}
              >
                {consignor.avatar ? <>更換頭像</> : <>上傳頭像</>}
              </Button>
              <p className='mt-2 text-xs leading-5 text-gray-400'>
                支援 PNG, JPG, JPEG
              </p>
            </div>
          </div>

          <div className='sm:col-span-full'>
            <p className='block text-sm font-medium leading-6 text-gray-900'>帳號</p>
            <div className='mt-2'>
              <p className='block text-sm font-medium leading-6 text-gray-700'>
                {consignor.account}
              </p>
            </div>
          </div>

          <div className='sm:col-span-full'>
            <p className='block text-sm font-medium leading-6 text-gray-900'>暱稱</p>
            <div className='mt-2'>
              <p className='block text-sm font-medium leading-6 text-gray-700'>
                {consignor.nickname}
              </p>
            </div>
          </div>

          <div className='sm:col-span-full'>
            <p className='block text-sm font-medium leading-6 text-gray-900'>
              LINE 通知
            </p>

            <div className='mt-2'>
              <p className='block text-sm font-medium leading-6 text-gray-700'>
                {consignor.lineId ? (
                  <span>
                    <CheckCircleIcon className='size-6 text-green-700' />
                  </span>
                ) : (
                  <p className='flex items-center gap-2'>
                    <ExclamationTriangleIcon
                      aria-hidden='true'
                      className='size-5 text-yellow-400'
                    />
                    <span>
                      請於
                      <a
                        href={configs.lineURL}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-link mx-0.5'
                      >
                        官方 LINE
                      </a>
                      中傳送<span className='font-bold underline'>綁定帳號</span>
                    </span>
                  </p>
                )}
              </p>
            </div>
          </div>

          <div className='sm:col-span-full'>
            <p className='block text-sm font-medium leading-6 text-gray-900'>
              回饋比例
            </p>
            <div className='mt-2'>
              <p className='block text-sm font-medium leading-6 text-gray-700'>
                {toPercent(consignor.commissionBonusRate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
