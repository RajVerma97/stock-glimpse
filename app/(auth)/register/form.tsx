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
          message: 'Registered successfully  Now Login',
        })
      } else {
        notify({ status: 'error', message: result?.error })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-4">
      <h1 className="mb-5 text-center text-3xl">Register</h1>
      <Input name="email" className="border border-black text-black" type="email" placeholder="Email" required />
      <Input
        name="password"
        className="border border-black text-black"
        type="password"
        placeholder="Password"
        required
      />
      <Button variant={'outline'} type="submit">
        Register
      </Button>

      <ToastManager />
    </form>
  )
}
