import NotSignedInError from '@/app/NotSignedInError'
import { getItem } from '@/app/api/frontend/getItem'
import { getUser } from '@/app/api/helpers/getUser'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductForm from '../../ProductForm'

interface PageProps {
  params: { id: string }
}

async function Page(pageProps: PageProps) {
  return (
    <div className='mx-auto max-w-3xl px-8'>
      <Link
        className='inline-flex items-center gap-x-1 text-sm text-indigo-600 hover:text-indigo-500'
        href='/products'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        回到商品列表
      </Link>

      <h1 className='mb-4 text-2xl font-bold tracking-tight text-gray-900'>
        编辑商品
      </h1>

      <Form {...pageProps} />
    </div>
  )
}

export default Page

async function Form({ params }: PageProps) {
  const user = await getUser()
  if (!user) {
    return <NotSignedInError />
  }

  const id = Number(params.id)
  if (isNaN(id)) {
    notFound()
  }

  const item = await getItem(id)
  if (item.error === '1003') {
    return <NotSignedInError />
  }

  return <ProductForm item={item.data} />
}
