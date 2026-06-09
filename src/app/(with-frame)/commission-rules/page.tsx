import { GetConfigs } from '@/api/frontend/GetConfigs'
import docStyle from '@/app/doc.module.scss'
import { HandleApiError } from '@/domain/api/HandleApiError'
import clsx from 'clsx'
import Decimal from 'decimal.js-light'
import { CommissionRulesContent } from './CommissionRulesContent'

export default async function Page() {
  const configsRes = await GetConfigs()

  if (configsRes.error) {
    return <HandleApiError error={configsRes.error} />
  }

  const rate = new Decimal(configsRes.data.commissionRate)
    .add(configsRes.data.yahooAuctionFeeRate)
    .toNumber()

  return (
    <main className={clsx('mx-auto max-w-prose px-4', docStyle.doc)}>
      <h1 className='h1'>網站使用規約</h1>
      <CommissionRulesContent rate={rate} />
    </main>
  )
}
