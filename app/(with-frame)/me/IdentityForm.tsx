'use client'

import { CONSIGNOR_STATUS_MAP } from '@/app/api/frontend/configs.data'
import { Consignor } from '@/app/api/frontend/consignor/getConsignor'
import { verifications } from '@/app/api/frontend/consignor/verifications'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
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

      <div className='md:col-span-2'>
        {consignor.askingVerification ? (
          <div className='rounded-md bg-blue-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <InformationCircleIcon
                  className='h-5 w-5 text-blue-400'
                  aria-hidden='true'
                />
              </div>
              <div className='ml-3 flex-1 md:flex md:justify-between'>
                <p className='text-sm text-blue-700'>身份認證審核中，請耐心等候</p>
              </div>
            </div>
          </div>
        ) : (
          <Form consignor={consignor} />
        )}
      </div>
    </div>
  )
}

function Form({ consignor }: { consignor: Consignor }) {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm<z.infer<typeof Schema>>({
    defaultValues: { ...consignor },
    resolver: zodResolver(Schema),
  })

  return (
    <form
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
                銀行代碼
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
          render={({ field, fieldState }) => {
            const src = field.value ? URL.createObjectURL(field.value) : null
            return (
              <div className='sm:col-span-full'>
                <label
                  htmlFor='identificationPhoto'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  身份證照片
                </label>
                <div className='mt-2'>
                  <label htmlFor='identificationPhoto'>
                    {src ? (
                      <img src={src} className='rounded-md' alt='' />
                    ) : (
                      <div className='flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                        <div className='text-center'>
                          <PhotoIcon
                            className='mx-auto h-12 w-12 text-gray-300'
                            aria-hidden='true'
                          />
                          <p className='text-xs leading-5 text-gray-600'>
                            支援 PNG, JPG, JPEG
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                <input
                  id='identificationPhoto'
                  hidden
                  type='file'
                  accept='image/*'
                  {...field}
                  value={undefined}
                  onChange={(e) => {
                    src && URL.revokeObjectURL(src)
                    const f = e.target.files?.item(0)
                    field.onChange(f)
                  }}
                />
                {fieldState.error && (
                  <p className='mt-1 text-sm text-red-600'>
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )
          }}
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
  )
}
