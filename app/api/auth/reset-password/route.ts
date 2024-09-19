import crypto from 'crypto'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/connectDB'
import User from '../../../../lib/models/Users'
import Logger from '../../../../lib/winstonLogger'

export async function POST(req: Request) {
  const { email, password, token } = await req.json()

  try {
    await connectDB()
    const user = await User.findOne({
      email,
    })

    if (!user) {
      NextResponse.json({ message: 'No user found with that token' }, { status: 404 })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    if (user.resetPasswordToken !== hashedToken || user.resetPasswordExpires < Date.now()) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    })
    return NextResponse.json({ message: 'Password Reset Successfully' }, { status: 200 })
  } catch (error) {
    Logger.error('Something went wrong', error)
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 })
  }
}
