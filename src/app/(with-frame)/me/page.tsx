import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { getUser } from '@/api/helpers/getUser'
import RedirectAuthError from '@/domain/auth/RedirectAuthError'
import { SITE_NAME } from '@/domain/static/static'
import { Metadata } from 'next'
import AccountInfoForm from './AccountInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import IdentityForm from './IdentityForm'
import { GetConfigs } from '@/api/frontend/GetConfigs'

export const metadata = { title: `帳號設定 | ${SITE_NAME}` } satisfies Metadata

export default async function Example() {
  const [user, consignorRes, configsRes] = await Promise.all([
    getUser(),
    GetConsignor(),
    GetConfigs(),
  ])

  if (!user || consignorRes.error === '1003' || configsRes.error === '1003') {
    return <RedirectAuthError />
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

            <IdentityForm consignor={consignorRes.data} configs={configsRes.data} />

            {/* <DeleteAccountForm /> */}
          </div>
        </main>
      </div>
    </>
  )
}
