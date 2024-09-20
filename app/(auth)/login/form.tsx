'use client'

import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notify, ToastManager } from '../../../components/ToastManager'
import { Button } from '../../../components/ui/button'
import SpinnerManager from '../../../components/SpinnerManager'
import { GithubSignInButton, GoogleSignInButton } from '../../../components/authButtons'
import { Input } from '../../../components/ui/input'

export default function Form() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)

    setError(null)

    const response = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    })

    if (response?.error) {
      notify({ status: 'error', message: response.error })
      setError(response.error)
      setIsLoading(false)
    } else if (response?.ok) {
      router.push('/')
    }
  }

  if (error) {
    notify({ status: 'error', message: error })
    setError(null)
  }

  return (
    <div className="flex min-h-screen p-4 md:px-16 md:py-10">
      <div className="flex w-full items-center justify-center bg-white p-4 md:w-1/2">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="mb-5 text-center text-3xl font-bold text-black">Login</h1>

          <div className="grid gap-4">
            <Input
              name="email"
              className="rounded border border-gray-300 p-3 text-gray-800"
              type="email"
              placeholder="Email"
              required
            />
            <Input
              name="password"
              className="rounded border border-gray-300 p-3 text-gray-800"
              type="password"
              placeholder="Password"
              required
            />
            <Button
              variant="secondary"
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-indigo-600 py-2 text-white transition duration-200 hover:bg-indigo-700"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <SpinnerManager isLoading={isLoading} />

            <div className="flex flex-col space-y-2">
              <GoogleSignInButton />
              <GithubSignInButton />
            </div>

            <div className="text-center">
              <Button asChild variant={'link'} className="hover:underline">
                <Link href="/forget-password">Forgot password?</Link>
              </Button>
            </div>
          </div>

          <ToastManager />
        </form>
      </div>

      <div className="relative hidden md:block md:w-1/2">
        <img src="/login.jpg" alt="Login Image" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}
