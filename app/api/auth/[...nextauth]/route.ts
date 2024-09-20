import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { connectDB } from '../../../../lib/connectDB'
import User from '../../../../lib/models/Users'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await User.findOne({ email: credentials.email }).exec()

        if (!user) {
          throw new Error('No user found with that email')
        }

        const passwordCorrect = await compare(credentials.password, user.password)

        if (passwordCorrect) {
          return {
            id: user._id.toString(),
            email: user.email,
          }
        }

        throw new Error('Incorrect password')
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB()

      const existingUser = await User.findOne({ email: user.email }).exec()

      if (!existingUser) {
        const newUser = new User({
          email: user.email,
          name: user.name,
          img: user.image,
          provider: account?.provider,
        })
        await newUser.save()
      }

      return true // Continue the sign-in process
    },
  },
})

export { handler as GET, handler as POST }
