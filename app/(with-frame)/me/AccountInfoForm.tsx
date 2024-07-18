'use client'

import { User } from '@/app/UserContext'
import { Consignor } from '@/app/api/frontend/consignor/GetConsignor'
import { UpdateConsignorAvatar } from '@/app/api/frontend/consignor/UpdateConsignorAvatar'
import { Button } from '@/app/catalyst-ui/button'
import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z.object({
  avatarPhoto: z.union([z.string(), z.instanceof(File)]).nullable(),
})

export default function AccountInfoForm({
  user,
  consignor,
}: {
  user: User
  consignor: Consignor
}) {
  const [isPending, startTransition] = useTransition()
  const [conformingDelete, setConformingDelete] = useState(false)

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>個人資訊</h2>
      </div>

      <div className='md:col-span-2'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <div className='flex items-center gap-x-8 sm:col-span-full'>
            <div className='group relative'>
              <div
                className={clsx(
                  'pointer-events-none absolute inset-0 z-10 transition-colors group-hover:bg-white/20',
                  isPending && 'animate-pulse bg-white/50',
                )}
                aria-hidden='true'
              />

              {user.avatar ? (
                <div className='group relative size-24 flex-none'>
                  <label htmlFor='avatarPhoto' className='block size-full'>
                    <Image
                      src={user.avatar}
                      className='size-full rounded-lg bg-gray-800 object-cover object-center'
                      priority
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
                              toast.error(`刪除頭像失敗: ${res.error}`)
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
                accept='image/*'
                onChange={(e) => {
                  startTransition(async () => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const formData = new FormData()
                    formData.append('avatarPhoto', file)
                    const res = await UpdateConsignorAvatar(formData)
                    if (res.error) {
                      toast.error(`頭像更新失敗: ${res.error}`)
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
                {user.avatar ? <>更換頭像</> : <>上傳頭像</>}
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
        </div>
      </div>
    </div>
  )
}
