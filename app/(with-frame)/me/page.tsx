import RedirectToHome from '@/app/RedirectToHome'
import { getConsignor } from '@/app/api/frontend/consignor/getConsignor'
import AccountInfoForm from './AccountInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import DeleteAccountForm from './DeleteAccountForm'
import IdentityForm from './IdentityForm'

export default async function Example() {
  const consignorRes = await getConsignor()

  if (consignorRes.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <>
      <div className='mx-auto mt-0 max-w-4xl lg:mt-10 lg:flex lg:gap-x-16 lg:px-8'>
        <h1 className='sr-only'>我的帳號設定</h1>

        <main className='px-4 sm:px-6 lg:flex-auto lg:px-0'>
          <div className='flex flex-col gap-y-12 px-4 sm:px-6 lg:px-8'>
            <AccountInfoForm consignor={consignorRes.data} />
            <div className='h-px bg-gray-200'></div>

            <ChangePasswordForm />
            <div className='h-px bg-gray-200'></div>

            <IdentityForm consignor={consignorRes.data} />
            <div className='h-px bg-gray-200'></div>

            <DeleteAccountForm />
          </div>
        </main>
      </div>
    </>
  )
}
