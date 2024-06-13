'use client'

import { session } from '@/app/api/session'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const Schema = z.object({
  account: z.string().min(1, { message: 'Account is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export function SignInForm() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<z.input<typeof Schema>>({
    defaultValues: {
      account: '',
      password: '',
    },
    resolver: zodResolver(Schema),
  })
  const router = useRouter()

  return (
    <>
      {errors.root && (
        <div className='mb-4 rounded-md bg-red-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-red-800'>
                {errors.root.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        className='space-y-6'
        onSubmit={handleSubmit(async (data) => {
          const res = await session(data)
          if (res.error === '1004' || res.error === '1602') {
            setError('root', { message: 'Account or password is incorrect' })
            return
          }
          const goto = new URLSearchParams(location.search).get('goto')
          router.replace(goto || '/')
        })}
      >
        <Controller
          control={control}
          name='account'
          render={({ field, fieldState }) => (
            <div>
              <label
                htmlFor='account'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Account
              </label>
              <div className='mt-2'>
                <input
                  id='account'
                  type='text'
                  className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  {...field}
                />
              </div>
              <p className='text-sm text-red-500'>{fieldState.error?.message}</p>
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
                Password
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
              <p className='text-sm text-red-500'>{fieldState.error?.message}</p>
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
            Sign up
          </button>
        </div>
      </form>
    </>
  )
}
