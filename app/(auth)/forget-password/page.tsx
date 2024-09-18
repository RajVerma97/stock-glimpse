'use client'

import SpinnerManager from '@/components/SpinnerManager'
import { notify, ToastManager } from '@/components/ToastManager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { CSSProperties, useState } from 'react'
import {
  CircleLoader,
  ClipLoader,
  MoonLoader,
  PacmanLoader,
  PuffLoader,
} from 'react-spinners'

export default function ForgetPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email) {
      notify({ status: 'error', message: 'Email is required' })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/forget-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (res.ok) {
        notify({
          status: 'success',
          message: 'Password reset link sent to your email',
        })
      } else {
        notify({
          status: 'error',
          message: data.message || 'Something went wrong',
        })
      }
    } catch (error) {
      notify({ status: 'error', message: 'Something went wrong' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 mx-auto max-w-md mt-10">
        <h1 className="text-3xl mb-8">Forget Password</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Email"
            className="text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" variant={'outline'} disabled={isLoading}>
            Send Reset Link
          </Button>
          <SpinnerManager isLoading={isLoading} />
          <ToastManager />
        </form>
      </div>
    </>
  )
}
