'use client'

import React, { useState } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation' // Added usePathname to detect current page
import { Button } from './ui/button'
import { notify, ToastManager } from './ToastManager'

export default function Header() {
  const [open, setOpen] = useState<boolean>(false)
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname() // Detect the current page path

  const openSidebar = () => {
    setOpen(true)
  }

  const closeSidebar = () => {
    setOpen(false)
  }

  const logout = async () => {
    await signOut()
  }

  const handleClick = () => {
    if (!session) {
      notify({ status: 'error', message: 'Please login to view your watchlist' })
    } else {
      router.push('/watchlist')
    }
  }

  return (
    <header className="mb-4 flex w-full items-center justify-between rounded-md px-4 py-2">
      <ToastManager />
      <div className="flex-1">
        <Link href="/" className="text-4xl font-bold">
          Stock Glimpse
        </Link>
      </div>
      <div className="hidden space-x-4 sm:flex">
        {session ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Button
            className={`${pathname === '/login' ? 'bg-white text-black' : 'bg-transparent'} hover:bg-white hover:text-black`}
          >
            <Link href="/login">Login</Link>
          </Button>
        )}
        <Button
          className={`${
            pathname === '/register' ? 'bg-white text-black' : 'bg-transparent'
          } hover:bg-white hover:text-black`} // Default to transparent, hover to white
        >
          <Link href="/register">Register</Link>
        </Button>
        <Button
          className={`${
            pathname === '/watchlist' ? 'bg-white text-black' : 'bg-transparent'
          } hover:bg-white hover:text-black`} // Default to transparent, hover to white
          onClick={handleClick}
        >
          Watchlist
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
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" onClick={closeSidebar}>
              <ArrowLeft size={30} />
            </Button>
          </div>

          <div className="mt-8 flex flex-col space-y-4 p-4">
            {session ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <Button
                className={`${
                  pathname === '/login' ? 'bg-white text-black' : 'bg-transparent'
                } hover:bg-white hover:text-black`}
                onClick={closeSidebar}
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button
              className={`${
                pathname === '/register' ? 'bg-white text-black' : 'bg-transparent'
              } hover:bg-white hover:text-black`} // Default to transparent, hover to white
              onClick={closeSidebar}
            >
              <Link href="/register">Register</Link>
            </Button>
            <Button
              className={`${
                pathname === '/watchlist' ? 'bg-white text-black' : 'bg-transparent'
              } hover:bg-white hover:text-black`} // Default to transparent, hover to white
              onClick={handleClick}
            >
              Watchlist
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  )
}
