'use client'

import React, { useState } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const { data: session } = useSession()

  const openSidebar = () => {
    setOpen(true)
  }

  const closeSidebar = () => {
    setOpen(false)
  }
  const logout = async () => {
    await signOut()
  }

  return (
    <header className="borer-2 mb-4 flex w-full items-center justify-between rounded-md border-blue-400 px-4 py-2 shadow-sm">
      <div>
        <Link href="/" className="text-2xl font-bold">
          Stock Glimpse...
        </Link>
      </div>
      <div className="hidden sm:flex">
        <Button variant="secondary" asChild>
          {session ? <Button onClick={logout}>Logout</Button> : <Link href="/login">Login</Link>}
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>

        <Button asChild>
          <Link href="/watchlist">Watchlist</Link>
        </Button>
      </div>
      <div className="sm:hidden">
        <Button onClick={openSidebar}>
          <Menu size={30} />
        </Button>
      </div>

      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 z-50 h-full w-3/4 bg-blue-500 shadow-lg sm:hidden"
        >
          <div className="p-4">
            <Button variant="ghost" onClick={closeSidebar}>
              <ArrowLeft size={30} />
            </Button>
          </div>
          <div className="mt-8 flex flex-col items-start px-4">
            <Link href="/login" onClick={closeSidebar}>
              Login
            </Link>

            <Link href="/register" className="text-xl" onClick={closeSidebar}>
              Register
            </Link>

            <Button>
              <Link href="/watchlist">Watchlist</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  )
}
