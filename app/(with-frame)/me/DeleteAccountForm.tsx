export default function DeleteAccountForm() {
  return (
    <div className='grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3'>
      <div>
        <h2 className='text-base font-medium leading-6 text-gray-900'>刪除帳號</h2>
        <p className='mt-1 text-sm leading-6 text-gray-400'>
          不再使用我們的服務嗎？ 你可以在這此刪除帳戶。
          此操作無法撤銷，此帳戶相關的所有資訊將永久刪除。
        </p>
      </div>

      <form className='flex items-start md:col-span-2'>
        <button
          type='submit'
          className='rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400'
        >
          是的，我要刪除帳號
        </button>
      </form>
    </div>
  )
}
