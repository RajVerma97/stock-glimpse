'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'
import googleLogo from '../public/google.png'
import githubLogo from '../public/github.png'

export function GoogleSignInButton() {
  const handleClick = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleClick}
      className="focus:shadow-outline mt-5 flex h-14 w-full items-center justify-center rounded-lg border-2 border-black bg-white px-6 text-xl font-semibold text-black transition-colors duration-300 hover:bg-slate-200"
    >
      <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  )
}

export function GithubSignInButton() {
  const handleClick = () => {
    signIn('github', { callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleClick}
      className="focus:shadow-outline flex h-14 w-full items-center justify-center rounded-lg border-2 border-black bg-white px-6 text-xl font-semibold text-black transition-colors duration-300 hover:bg-slate-200"
    >
      <Image src={githubLogo} alt="Github Logo" width={20} height={20} />
      <span className="ml-4">Continue with Github</span>
    </button>
  )
}
