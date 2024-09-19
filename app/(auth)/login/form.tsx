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
    <>
      <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-2">
        <h1 className="mb-5 text-center text-3xl">Login</h1>
        <Input name="email" className="border border-black text-black" type="email" placeholder="Email" required />
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
