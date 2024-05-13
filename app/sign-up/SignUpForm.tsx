'use client'
import clsx from 'clsx'
import { useState, useTransition } from 'react'
import { signUp } from './actions'

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const [apiResult, setApiResult] = useState<Awaited<ReturnType<typeof signUp>>>()

  return (
    <form
      action={async (formData) => {
        startTransition(async () => {
          const data = await signUp(formData)
          setApiResult(data)
        })
      }}
      className='space-y-6'
    >
      <div>
        <label
          htmlFor='nickname'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Nickname
        </label>
        <div className='mt-2'>
          <input
            id='nickname'
            name='nickname'
            type='text'
            required
            className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

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

      <div>
        <label
          htmlFor='conformPassword'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Conform password
        </label>
        <div className='mt-2'>
          <input
            id='conformPassword'
            name='conformPassword'
            type='password'
            autoComplete='off'
            required
            className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          {apiResult?.error?.fieldErrors.conformPassword && (
            <p className='text-sm text-red-500'>
              {apiResult?.error?.fieldErrors.conformPassword[0]}
            </p>
          )}
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
  )
}
