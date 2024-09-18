import { DATE_FORMAT } from '@/app/utils/dateFormat'
import axios from 'axios'
import dayjs from 'dayjs'
import { NextResponse } from 'next/server'

interface HistoricalDataEntry {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

async function fetchHistoricalData(
  symbol: string,
): Promise<HistoricalDataEntry[]> {
  const polygonApiKey = process.env.POLYGON_API_KEY
  if (!polygonApiKey) {
    throw new Error('POLYGON_API_KEY is not defined')
  }

  const now = dayjs()
  const interval = '1/day'
  const startDate = now.subtract(1, 'year').format('YYYY-MM-DD')
  const endDate = now.format('YYYY-MM-DD')

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${interval}/${startDate}/${endDate}?apiKey=${polygonApiKey}`

  try {
    const response = await axios.get(url)

    const newData = response.data.results.map((entry: any) => ({
      date: dayjs(entry.t).format('YYYY-MM-DD'),
      open: entry.o,
      high: entry.h,
      low: entry.l,
      close: entry.c,
      volume: entry.v,
    }))
    return newData
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } },
) {
  const { symbol } = params

  try {
    const historicalData = await fetchHistoricalData(symbol)
    return NextResponse.json(historicalData)
  } catch (error) {
    console.error('GET request error:', error)

    let errorMessage = 'Failed to fetch historical data'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.error || error.message || errorMessage
      statusCode = error.response?.status || 500
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
