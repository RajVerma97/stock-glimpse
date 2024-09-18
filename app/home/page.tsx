'use client'
import { SessionProvider, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Logout from '../logout'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return <p>No session found</p>
  }

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <SessionProvider>
      <div>
        <h1>Home page </h1>
        <div>Email --- {session?.user?.email}</div>
        <div>Username --- {session?.user?.name}</div>
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="profile"
            width={50}
            height={50}
          />
        )}
        {session ? (
          <Button onClick={logout} variant={'outline'}>
            Logout
          </Button>
        ) : (
          <></>
        )}
      </div>
    </SessionProvider>
  )
}
