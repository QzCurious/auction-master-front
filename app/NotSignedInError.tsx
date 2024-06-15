import { XCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function NotSignedInError() {
  return (
    <div className='mx-auto max-w-2xl rounded-md bg-red-50 p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-yellow-800'>
            You are not signed in
          </h3>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>
              Please{' '}
              <Link href='/sign-in' className='text-indigo-600 hover:text-indigo-500'>
                sign in
              </Link>{' '}
              or{' '}
              <Link href='/sign-up' className='text-indigo-600 hover:text-indigo-500'>
                sign up
              </Link>{' '}
              to view this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
