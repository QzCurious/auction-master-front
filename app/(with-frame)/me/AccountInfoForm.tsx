import { User } from '@/app/UserContext'

export default function AccountInfoForm({ user }: { user: User }) {
  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>個人資訊</h2>
        {/* <p className='mt-1 text-sm leading-6 text-gray-400'>
          Use a permanent address where you can receive mail.
        </p> */}
      </div>

      <form className='md:col-span-2'>
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
                {user.account}
              </p>
            </div>
          </div>

          <div className='sm:col-span-full'>
            <label
              htmlFor='nickname'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              暱稱
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='nickname'
                id='nickname'
                autoComplete='given-name'
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
