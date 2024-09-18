import { error } from 'console'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'
import User from '@/lib/models/Users'
import { connectDB } from '@/lib/connectDB'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    const user = await User.findOne({ email }).exec()

    if (user) {
      return NextResponse.json(
        {
          message:
            'Can' + 't register , User already exists,please login instead',
          error,
        },
        { status: 400 },
      )
    }

    const hashedPassword = await hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json({ message: 'success' })
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: 'error', error: e.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: 'error', error: 'An unknown error occurred' },
      { status: 500 },
    )
  }
}
