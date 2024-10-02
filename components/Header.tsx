'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
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
        <Link href="/" className="text-2xl font-bold">
          Stock Glimpse
        </Link>
      </div>
      <div className="hidden space-x-4 sm:flex">
        {session ? (
          <Button
            variant="default"
            className="rounded-lg border-2 border-pink-500 px-6 py-2 font-semibold transition duration-300 ease-in-out hover:bg-pink-500 hover:text-white"
            onClick={logout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              className={`${pathname === '/login' ? 'bg-white text-black' : 'bg-transparent'} hover:bg-white hover:text-black`}
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              className={`${
                pathname === '/register' ? 'bg-white text-black' : 'bg-transparent'
              } hover:bg-white hover:text-black`} // Default to transparent, hover to white
            >
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}

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
          className="fixed right-0 top-0 z-50 h-full w-3/4 bg-white shadow-lg sm:hidden"
        >
          <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-xl font-semibold text-black">Menu</h1>
            <Button variant="ghost" onClick={closeSidebar} className="text-black">
              <X size={30} />
            </Button>
          </div>

          <div className="mt-6 flex flex-col space-y-4 p-4">
            {session ? (
              <Button
                variant="default"
                className="rounded-lg border-2 border-pink-500 bg-pink-500 px-6 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-white hover:text-pink-500"
                onClick={logout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  className={`rounded-lg px-6 py-2 font-semibold transition duration-300 ease-in-out ${
                    pathname === '/login' ? 'bg-indigo-500 text-white' : 'bg-black text-white'
                  } hover:bg-black hover:text-white`}
                  onClick={closeSidebar}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  className={`rounded-lg px-6 py-2 font-semibold transition duration-300 ease-in-out ${
                    pathname === '/register' ? 'bg-indigo-500 text-white' : 'bg-black text-white'
                  } hover:bg-black hover:text-white`}
                  onClick={closeSidebar}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}

            <Button
              className={`rounded-lg px-6 py-2 font-semibold transition duration-300 ease-in-out ${
                pathname === '/watchlist' ? 'bg-indigo-500 text-white' : 'bg-black text-white'
              } hover:bg-black hover:text-white`}
              onClick={handleClick}
            >
              Watchlist
            </Button>
          </div>
        </motion.div>
      )}{' '}
    </header>
  )
}
