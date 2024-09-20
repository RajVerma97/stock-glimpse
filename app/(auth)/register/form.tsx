'use client'

import { signIn } from 'next-auth/react'
import { FormEvent } from 'react'
import { notify, ToastManager } from '../../../components/ToastManager'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

export default function Form() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      notify({ status: 'error', message: result.message })
    } else {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.get('email'),
        password: formData.get('password'),
      })

      if (result?.ok) {
        notify({
          status: 'success',
          message: 'Registered successfully. Now Login',
        })
      } else {
        notify({ status: 'error', message: result?.error || 'Unknown error' })
      }
    }
  }

  return (
    <div className="flex min-h-screen p-4 md:px-16 md:py-10">
      <div className="flex w-full items-center justify-center bg-white p-4 md:w-1/2">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="mb-5 text-center text-3xl font-bold text-black">Register</h1>
          <Input name="email" className="border border-black text-black " type="email" placeholder="Email" required />
          <Input
            name="password"
            className="border border-black text-black mt-4"
            type="password"
            placeholder="Password"
            required
          />
          <Button variant={'outline'} type="submit" className="border-none bg-indigo-500 text-white mt-4 w-full">
            Register
          </Button>

          <ToastManager />
        </form>
      </div>

      <div className="relative hidden md:block md:w-1/2">
        <img src="/register.jpg" alt="Register Image" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
