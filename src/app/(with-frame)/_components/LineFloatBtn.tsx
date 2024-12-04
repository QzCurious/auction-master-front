import { GetConfigs } from '@/api/frontend/GetConfigs'
import Image from 'next/image'
import img from './LINE_APP_Android.png'

export default async function LineFloatBtn() {
  if (process.env.NEXT_PUBLIC_IS_MAINTENANCE) return null

  const { data } = await GetConfigs()

  if (!data) return null

  return (
    <a
      href={data.lineURL}
      target='_blank'
      rel='noopener noreferrer'
      className='fixed bottom-20 right-4 block size-12 transition-opacity hover:opacity-70 lg:bottom-12'
    >
      <Image src={img} alt='Contact by LINE' />
    </a>
  )
}
