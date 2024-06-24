'use client'
import { consignor } from '@/app/api/consignor'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const Schema = z
  .object({
    nickname: z.string().min(1, { message: 'Nickname is required' }),
    account: z.string().min(1, { message: 'Account is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    conformPassword: z.string().min(1, { message: 'Conform Password is required' }),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: 'Conform Password does not match Password',
    path: ['conformPassword'],
  })

export function SignUpForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<z.input<typeof Schema>>({
    defaultValues: {
      nickname: '',
      account: '',
      password: '',
      conformPassword: '',
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit(async (data) => {
        const result = await consignor(data)
        if (result.error === '1601') {
          setError('account', { message: 'Account already exists' })
          return
        }
        router.push('/')
      })}
    >
      <Controller
        control={control}
        name='nickname'
        render={({ field, fieldState }) => (
          <div>
            <label
              htmlFor='nickname'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              暱稱
            </label>
            <div className='mt-2'>
              <input
                id='nickname'
                type='text'
                className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                {...field}
              />
            </div>
            {fieldState.error && (
              <p className='mt-1 text-sm text-red-600'>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name='account'
        render={({ field, fieldState }) => (
          <div>
            <label
              htmlFor='account'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              帳號
            </label>
            <div className='mt-2'>
              <input
                id='account'
                type='text'
                className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                {...field}
              />
            </div>
            {fieldState.error && (
              <p className='mt-1 text-sm text-red-600'>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name='password'
        render={({ field, fieldState }) => (
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              密碼
            </label>
            <div className='mt-2'>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                {...field}
              />
            </div>
            {fieldState.error && (
              <p className='mt-1 text-sm text-red-600'>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name='conformPassword'
        render={({ field, fieldState }) => (
          <div>
            <label
              htmlFor='conformPassword'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              確認密碼
            </label>
            <div className='mt-2'>
              <input
                id='conformPassword'
                type='password'
                autoComplete='off'
                className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                {...field}
              />
            </div>
            {fieldState.error && (
              <p className='mt-1 text-sm text-red-600'>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {/* <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
          />
          <label
            htmlFor='remember-me'
            className='ml-3 block text-sm leading-6 text-gray-700'
          >
            Remember me
          </label>
        </div>
      </div> */}

      <div>
        <button
          type='submit'
          className={clsx(
            'flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            isSubmitting && 'pointer-events-none opacity-50',
          )}
        >
          {isSubmitting && (
            <span className='mr-2 size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
          )}
          註冊
        </button>
      </div>
    </form>
  )
}
