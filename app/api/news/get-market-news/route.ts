import axios from 'axios'
import { NextResponse } from 'next/server'
import Logger from '../../../../lib/winstonLogger'

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 })
  }

  // Use the Finnhub API for stock news
  const newsApiUrl = `https://finnhub.io/api/v1/news?category=stock&minId=10&token=${apiKey}`

  try {
    const response = await axios.get(newsApiUrl)

    if (!response.data || response.data.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    return NextResponse.json(response.data, { status: 200 })
  } catch (error) {
    Logger.error('Failed to fetch stock news', error)
    return NextResponse.json({ error: 'Failed to fetch stock news' + error }, { status: 500 })
  }
}
