import { cookies } from 'next/headers'
import Link from 'next/link'
import { logout } from './actions'

export default async function Home() {
  const account = cookies().get('account')?.value

  return (
    <main>
      <div className='flex gap-x-4 p-4 text-blue-700 underline'>
        <Link href='/login'>Login</Link>
        <Link href='/sign-up'>Sign Up</Link>
      </div>

      <div className='p-4'>
        {account ? (
          <form action={logout}>
            <p>
              Account: {account}{' '}
              <button className='ml-4 text-red-700 underline'>Logout</button>
            </p>
          </form>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
    </main>
  )
}
