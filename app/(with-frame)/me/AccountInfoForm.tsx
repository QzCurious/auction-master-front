'use client'

import { Consignor } from '@/app/api/frontend/consignor/getConsignor'
import { updateConsignor } from '@/app/api/frontend/consignor/updateConsignor'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z.object({
  nickname: z.string().min(1),
})

export default function AccountInfoForm({ consignor }: { consignor: Consignor }) {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues: {
      nickname: consignor.nickname,
    },
    resolver: zodResolver(Schema),
  })

  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>個人資訊</h2>
        {/* <p className='mt-1 text-sm leading-6 text-gray-400'>
          Use a permanent address where you can receive mail.
        </p> */}
      </div>

      <form
        className='md:col-span-2'
        onSubmit={handleSubmit(async (data) => {
          const res = await updateConsignor(data)
          if (res.error) {
            toast.error(`操作錯誤: ${res.error}`)
            return
          }
          toast.success('更新成功')
        })}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <div className='col-span-full flex items-center gap-x-8'>
            <img
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt=''
              className='h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover'
            />
            <div>
              <button
                type='button'
                className='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              >
                更換頭像
              </button>
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

          <Controller
            name='nickname'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-full'>
                <label
                  htmlFor='nickname'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  暱稱
                </label>
                <div className='mt-2'>
                  <div>
                    <input
                      type='text'
                      id='nickname'
                      autoComplete='given-name'
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      {...field}
                    />
                    <p className='mt-2 text-sm text-red-600'>
                      {fieldState.error?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className='mt-8 flex'>
          <button
            type='submit'
            className={clsx(
              'rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
              isSubmitting && 'pointer-events-none opacity-50',
            )}
          >
            {isSubmitting && (
              <span className='mr-2 size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
            )}
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
