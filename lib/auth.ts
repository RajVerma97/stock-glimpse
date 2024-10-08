'use client'
import { NextAuthOptions, getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { NextResponse } from 'next/server'
import { useEffect } from 'react'

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
}

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
  }
}

export function useRequireLogin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Wait for session to load
    if (!session) router.push('/') // Redirect to login if not authenticated
  }, [session, status, router])
}
