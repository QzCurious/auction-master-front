'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='mx-auto max-w-2xl rounded-md bg-red-50 p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ExclamationTriangleIcon
            className='h-5 w-5 text-red-400'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-red-800'>Error</h3>
          <div className='mt-2 text-sm text-red-700'>
            <p>
              發生錯誤，請
              <button
                type='button'
                className='font-medium text-indigo-600 underline hover:text-indigo-500'
                onClick={reset}
              >
                再試一次
              </button>
              {error.digest && (
                <>
                  {' '}
                  或將錯誤回報給我們: <code>{error.digest}</code>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
