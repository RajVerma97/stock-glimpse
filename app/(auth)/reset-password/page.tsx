'use client'

import React, { useEffect, useState } from 'react'
import { notify, ToastManager } from '../../../components/ToastManager'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import SpinnerManager from '../../../components/SpinnerManager'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const tokenFromQuery = query.get('token')
    const emailFromQuery = query.get('email')

    if (tokenFromQuery) {
      setToken(tokenFromQuery)
    }

    if (emailFromQuery) {
      setEmail(emailFromQuery)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!password || !confirmPassword) {
      notify({ status: 'error', message: 'Password fields must be filled' })
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      notify({ status: 'error', message: 'Passwords must match' })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, password, token }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (res.ok) {
        notify({ status: 'success', message: data.message })
        setPassword('')
        setConfirmPassword('')
      } else {
        notify({ status: 'error', message: data.message })
      }
    } catch (error) {
      notify({ status: 'error', message: 'Something went wrong' + error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-md flex-col gap-2">
        <h1 className="mb-8 text-3xl">Reset Your Password</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black text-black"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-black"
              placeholder="Confirm Password"
              required
            />
          </div>
          <Button variant={'outline'} type="submit" disabled={isLoading}>
            Reset Password
          </Button>
          <SpinnerManager isLoading={isLoading} />
          <ToastManager />
        </form>
      </div>
    </>
  )
}
