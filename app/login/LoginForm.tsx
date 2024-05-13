'use client'
import { XCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState, useTransition } from 'react'
import { login } from './actions'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [apiResult, setApiResult] = useState<Awaited<ReturnType<typeof login>>>()

  return (
    <>
      {apiResult?.error?.formErrors && (
        <div className='mb-4 rounded-md bg-red-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-red-800'>
                There were some errors with your submission
              </h3>
              <div className='mt-2 text-sm text-red-700'>
                <ul role='list' className='list-disc space-y-1 pl-5'>
                  {apiResult.error.formErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        action={async (formData) => {
          startTransition(async () => {
            const data = await login(formData)
            setApiResult(data)
          })
        }}
        className='space-y-6'
      >
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
              name='account'
              type='text'
              required
              className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

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
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
          </div>
        </div>

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
              isPending && 'cursor-not-allowed opacity-50',
            )}
          >
            {isPending && (
              <span className='mr-2 size-3 animate-spin self-center rounded-full border-2 border-l-0 border-indigo-200'></span>
            )}
            Sign up
          </button>
        </div>
      </form>
    </>
  )
}
