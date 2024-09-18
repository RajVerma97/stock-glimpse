'use client'

import {
  GithubSignInButton,
  GoogleSignInButton,
} from '@/components/authButtons'
import SpinnerManager from '@/components/SpinnerManager'
import { notify, ToastManager } from '@/components/ToastManager'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mx-auto max-w-md mt-10"
      >
        <h1 className="text-3xl text-center mb-5">Login</h1>
        <Input
          name="email"
          className="border border-black text-black"
          type="email"
          placeholder="Email"
          required
        />
        <Input
          name="password"
          className="border border-black text-black"
          type="password"
          placeholder="Password"
          required
        />
        <Button variant={'outline'} type="submit" disabled={isLoading}>
          Login
        </Button>

        <SpinnerManager isLoading={isLoading} />

        <GoogleSignInButton />
        <GithubSignInButton />
        <Button asChild variant={'link'}>
          <Link href="/forget-password">Forget password?</Link>
        </Button>
        <ToastManager />
      </form>
    </>
  )
}
