import RedirectToHome from '@/app/RedirectToHome'
import { GetConsignor } from '@/app/api/frontend/consignor/GetConsignor'
import { CONSIGNOR_STATUS } from '@/app/api/frontend/static-configs.data'
import { getUser } from '@/app/api/helpers/getUser'
import { SITE_NAME } from '@/app/static'
import { Metadata } from 'next'
import AccountInfoForm from './AccountInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import IdentityForm from './IdentityForm'

export const metadata = { title: `帳號設定 | ${SITE_NAME}` } satisfies Metadata

export default async function Example() {
  const [user, consignorRes] = await Promise.all([getUser(), GetConsignor()])

  if (!user || consignorRes.error === '1003') {
    return <RedirectToHome />
  }

  return (
    <>
      <div className='mx-auto mt-0 max-w-4xl lg:mt-10 lg:flex lg:gap-x-16 lg:px-8'>
        <h1 className='sr-only'>我的帳號設定</h1>

        <main className='px-4 sm:px-6 lg:flex-auto lg:px-0'>
          <div className='flex flex-col gap-y-12 px-4 sm:px-6 lg:px-8'>
            <AccountInfoForm user={user} consignor={consignorRes.data} />
            <div className='h-px bg-gray-200'></div>

            <ChangePasswordForm />
            <div className='h-px bg-gray-200'></div>

            <IdentityForm
              consignor={consignorRes.data}
              alert={
                user.status ===
                CONSIGNOR_STATUS.enum('AwaitingVerificationCompletionStatus')
              }
            />

            {/* <DeleteAccountForm /> */}
          </div>
        </main>
      </div>
    </>
  )
}
