import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '../../../../lib/auth'
import User from '../../../../lib/models/Users'
import { connectDB } from '../../../../lib/connectDB'
import Logger from '../../../../lib/winstonLogger'

export async function GET() {
  const session = await getServerSession(authConfig)

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Login required' }, { status: 401 })
  }

  try {
    await connectDB()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ message: 'User not found in DB' }, { status: 404 })
    }

    const { watchlist } = user
    return NextResponse.json({ watchlist }, { status: 200 })
  } catch (error) {
    Logger.error('Error Fetching Watchlist' + error)
    return NextResponse.json({ message: 'Internal server error' + error }, { status: 500 })
  }
}
