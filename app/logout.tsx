'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '../components/ui/button'

export default function Logout() {
  const { data: session } = useSession()

  const logout = async () => {
    await signOut()
  }

  return (
    <>
      {session ? (
        <Button onClick={logout} variant="outline" className="mt-4">
          Logout
        </Button>
      ) : null}
    </>
  )
}
