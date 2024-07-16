import Image from 'next/image'
import { configs } from '../api/frontend/configs'
import img from './LINE_APP_Android.png'

export default async function LineFloatBtn() {
  const { data } = await configs()

  if (!data) return null

  return (
    <a
      href={data.lineURL}
      target='_blank'
      rel='noopener noreferrer'
      className='fixed bottom-12 right-4 block size-12 transition-opacity hover:opacity-70'
    >
      <Image src={img} alt='Contact by LINE' />
    </a>
  )
}
