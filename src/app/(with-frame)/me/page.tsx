import { GetConsignor } from '@/api/frontend/consignor/GetConsignor'
import { GetConfigs } from '@/api/frontend/GetConfigs'
import RedirectAuthError from '@/domain/auth/RedirectAuthError'
import { SITE_NAME } from '@/domain/static/static'
import { Metadata } from 'next'
import AccountInfoForm from './AccountInfoForm'
import ChangePasswordForm from './ChangePasswordForm'
import IdentityForm from './IdentityForm'
import { Heading } from '@/catalyst-ui/heading'

export const metadata = { title: `帳號設定 | ${SITE_NAME}` } satisfies Metadata

export default async function Example() {
  const [consignorRes, configsRes] = await Promise.all([GetConsignor(), GetConfigs()])

  if (consignorRes.error === '1003' || configsRes.error === '1003') {
    return <RedirectAuthError />
  }

  return (
    <main className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
      <Heading>帳號設定</Heading>

      <div className='mt-10 lg:flex-auto'>
        <div className='flex flex-col gap-y-12'>
          <AccountInfoForm consignor={consignorRes.data} />
          <div className='h-px bg-gray-200'></div>

          <ChangePasswordForm />
          <div className='h-px bg-gray-200'></div>

          <IdentityForm consignor={consignorRes.data} configs={configsRes.data} />

          {/* <DeleteAccountForm /> */}
        </div>
      </div>
    </main>
  )
}
