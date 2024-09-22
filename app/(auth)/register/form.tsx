'use client'

import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { notify, ToastManager } from '../../../components/ToastManager'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

export default function Form() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

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
      console.log(result)
      setError(result.message || 'Registration failed')
      setSuccess(null) // Clear success message
    } else {
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.get('email'),
        password: formData.get('password'),
      })

      if (signInResult?.ok) {
        setSuccess('Registered successfully. ')
        setError(null) // Clear error message

        // Redirect to the home page
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(signInResult?.error || 'Unknown error')
        setSuccess(null) // Clear success message
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden rounded-lg md:flex-row-reverse md:px-16 md:py-10">
      <div className="h-70 relative md:h-auto md:w-1/2">
        <img src="/register.jpg" alt="Register Image" className="h-full w-full object-cover" />
      </div>
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="mb-5 text-center text-3xl font-bold text-black">Register</h1>
          <Input name="email" className="border border-black text-black" type="email" placeholder="Email" required />
          <Input
            name="password"
            className="mt-4 border border-black text-black"
            type="password"
            placeholder="Password"
            required
          />
          {error && <p className="mt-2 rounded border border-red-500 bg-red-100 p-2 text-red-600">{error}</p>}
          {success && <p className="mt-2 rounded border border-green-500 bg-green-100 p-2 text-green-600">{success}</p>}
          <Button
            variant="outline"
            type="submit"
            className="mt-4 w-full bg-indigo-500 text-white transition duration-200 hover:bg-black hover:text-white"
          >
            Register
          </Button>
        </form>
        <ToastManager />
      </div>
    </div>
  )
}
