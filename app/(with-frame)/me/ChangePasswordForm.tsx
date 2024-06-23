import React from 'react'

export default function ChangePasswordForm() {
  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>變更密碼</h2>
        {/* <p className='mt-1 text-sm leading-6 text-gray-400'>
          Update your password associated with your account.
        </p> */}
      </div>

      <form className='md:col-span-2'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
          <div className='col-span-full'>
            <label
              htmlFor='current-password'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              當前密碼
            </label>
            <div className='mt-2'>
              <input
                id='current-password'
                name='current_password'
                type='password'
                autoComplete='current-password'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='col-span-full'>
            <label
              htmlFor='new-password'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              新密碼
            </label>
            <div className='mt-2'>
              <input
                id='new-password'
                name='new_password'
                type='password'
                autoComplete='new-password'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='col-span-full'>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              確認密碼
            </label>
            <div className='mt-2'>
              <input
                id='confirm-password'
                name='confirm_password'
                type='password'
                autoComplete='new-password'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>
        </div>

        <div className='mt-8 flex'>
          <button
            type='submit'
            className='rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
