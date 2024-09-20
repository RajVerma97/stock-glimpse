import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import User from '../../../../../lib/models/Users'
import { authConfig } from '../../../../../lib/auth'
import Logger from '../../../../../lib/winstonLogger'

export async function DELETE(request: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params

  if (!symbol) {
    return NextResponse.json({ message: 'Symbol parameter is missing' }, { status: 400 })
  }

  const session = await getServerSession(authConfig)

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Login required' }, { status: 401 })
  }

  try {
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const index = user.watchlist.findIndex((item: { symbol: string }) => item.symbol === symbol)

    if (index === -1) {
      return NextResponse.json({ message: 'Symbol not found in watchlist' }, { status: 404 })
    }

    user.watchlist.splice(index, 1)
    await user.save()

    return NextResponse.json({ message: 'Removed from watchlist' }, { status: 200 })
  } catch (error) {
    const errorMessage = (error as Error).message || 'Internal Server Error'
    Logger.error('Error removing from watchlist: ' + errorMessage)
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 })
  }
}
