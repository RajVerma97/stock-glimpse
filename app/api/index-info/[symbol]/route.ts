import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
