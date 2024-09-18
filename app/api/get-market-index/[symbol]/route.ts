import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } },
) {
  const { symbol } = params

  try {
    const response = await axios.get(
      `https://data.alpaca.markets/v2/stocks/${symbol}/quotes/latest`,
      {
        headers: {
          'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
          'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY,
        },
      },
    )
    const quote = response.data?.quote

    if (!quote) {
      return NextResponse.json({ status: 500, error: 'No data found' })
    }

    const formattedData = {
      askPrice: quote.ap * 10,
      askSize: quote.as,
      bidPrice: quote.bp * 10,
      bidSize: quote.bs,
      askExchange: quote.ax,
      timestamp: quote.t,
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching data:', error)

    return NextResponse.json({ status: 500, error: 'Failed to fetch data' })
  }
}
