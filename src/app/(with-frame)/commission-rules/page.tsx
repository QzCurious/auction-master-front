import docStyle from '@/app/doc.module.scss'
import clsx from 'clsx'
import { Content } from './Content'

export default function Page() {
  return (
    <main className={clsx('mx-auto max-w-prose px-4', docStyle.doc)}>
      <h1 className='h1'>網站使用規約</h1>
      <Content />
    </main>
  )
}
