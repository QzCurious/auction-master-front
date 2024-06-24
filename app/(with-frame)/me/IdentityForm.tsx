'use client'

import { CONSIGNOR_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { Consignor } from '@/app/api/frontend/consignor/getConsignor'
import { verifications } from '@/app/api/frontend/consignor/verifications'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const Schema = z.object({
  identificationPhoto: z
    .instanceof(File, { message: '必填' })
    .refine((file) => file.size <= 20 * 1024 * 1024, { message: '上限 20MB' }),
  name: z.string().min(1, { message: '必填' }),
  identification: z.string().min(1, { message: '必填' }),
  phone: z.string().min(1, { message: '必填' }),
  bankCode: z.string().min(1, { message: '必填' }),
  bankAccount: z.string().min(1, { message: '必填' }),
})

export default function IdentityForm({ consignor }: { consignor: Consignor }) {
  const defaultValues = useMemo(
    () => ({
      ...consignor,
      name: '',
      identification: '',
    }),
    [consignor],
  )
  const router = useRouter()
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues,
    resolver: zodResolver(Schema),
  })

  return (
    <div
      id='identity-form'
      className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'
    >
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>
          身份認證
          {consignor.status === CONSIGNOR_STATUS_MAP.EnabledStatus && (
            <span>
              已完成
              <CheckCircleIcon className='ml-1 inline-block size-5 text-green-500' />
            </span>
          )}
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-400'>
          完成身份認證即可開始托售物品
        </p>
      </div>

      <form
        className='md:col-span-2'
        onSubmit={handleSubmit(async (data, e) => {
          const formData = new FormData(e?.target)
          const res = await verifications(formData)
          if (res.error === '1003') {
            toast.error('請重新登入')
            return
          }

          toast.success('身份認證申請已送出')
        })}
      >
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-3'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  姓名
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='name'
                    autoComplete='name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name='identification'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-3'>
                <label
                  htmlFor='identification'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  身分證字號
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='identification'
                    autoComplete='off'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name='phone'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-3'>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  手機號碼
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='phone'
                    autoComplete='mobile tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className='sm:col-span-3'>{/* empty */}</div>

          <Controller
            name='bankCode'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-2'>
                <label
                  htmlFor='bankCode'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  銀行代號
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='bankCode'
                    autoComplete='off'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name='bankAccount'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-4'>
                <label
                  htmlFor='bankAccount'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  銀行戶號
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='bankAccount'
                    autoComplete='off'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    {...field}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name='identificationPhoto'
            control={control}
            render={({ field, fieldState }) => (
              <div className='sm:col-span-full'>
                <label
                  htmlFor='identificationPhoto'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  身份證照片
                </label>
                <div className='mt-2'>
                  <input
                    id='identificationPhoto'
                    type='file'
                    accept='image/*'
                    {...field}
                    value={undefined}
                    onChange={(e) => {
                      const f = e.target.files?.item(0)
                      if (!f) return
                      field.onChange(f)
                    }}
                  />
                </div>
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className='mt-8 flex'>
          {consignor.status ===
            CONSIGNOR_STATUS_MAP.AwaitingVerificationCompletionStatus && (
            <button
              type='submit'
              className={clsx(
                'rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
                isSubmitting && 'pointer-events-none opacity-50',
              )}
            >
              {isSubmitting && (
                <span className='mr-2 inline-block size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
              )}
              送出
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
