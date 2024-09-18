import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } },
) {
  const apiKey = process.env.MARKETAUX_NEWS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ message: 'API key not found' }, { status: 500 })
  }
  const { symbol } = params

  try {
    const newsUrl = `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=${apiKey}`
    const response = await axios.get(newsUrl)

    if (!response || !response.data) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 })
    }

    return NextResponse.json(response.data.data, { status: 200 })
  } catch (error) {
    console.error('Error fetching stock news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock news' },
      { status: 500 },
    )
  }
}
