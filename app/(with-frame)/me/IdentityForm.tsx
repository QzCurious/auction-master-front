export default function IdentityForm() {
  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>身份認證</h2>
        <p className='mt-1 text-sm leading-6 text-gray-400'>
          完成身份認證即可開始托售物品
        </p>
      </div>

      <form className='md:col-span-2'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6'>
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
                name='name'
                id='name'
                autoComplete='name'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

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
                name='identification'
                id='identification'
                autoComplete='off'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

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
                name='phone'
                id='phone'
                autoComplete='mobile tel'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-3'>{/* empty */}</div>

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
                name='bankCode'
                id='bankCode'
                autoComplete='off'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

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
                name='bankAccount'
                id='bankAccount'
                autoComplete='off'
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
