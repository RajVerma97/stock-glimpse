import { NextResponse } from 'next/server'
import axios from 'axios'
import Logger from '../../../lib/winstonLogger'

const BASE_URL = 'https://finnhub.io/api/v1'

async function fetchRealTimePrice(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch real-time data: ' + error }, { status: 500 })
  }
}

async function fetchStockProfile(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/stock/profile2`, {
      params: {
        symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    })
    return response.data
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock profile: ' + error }, { status: 500 })
  }
}

function calculatePercentageChange(open: number, close: number): number {
  return ((close - open) / open) * 100
}

function formatStockChanges(
  changes: {
    symbol: string
    name: string
    logo: string
    currentPrice: number
    change: number
  }[],
) {
  return changes.map((stock) => ({
    ...stock,
    change: stock.change.toFixed(2), // Format change to 2 decimal places
    currentPrice: stock.currentPrice.toFixed(2), // Format current price to 2 decimal places
  }))
}

async function getStockChanges(symbols: string[]) {
  const stockChanges: {
    symbol: string
    name: string
    logo: string
    currentPrice: number
    change: number
  }[] = []

  for (const symbol of symbols) {
    try {
      const [priceData, profileData] = await Promise.all([fetchRealTimePrice(symbol), fetchStockProfile(symbol)])

      const { c: currentPrice, o: openPrice } = priceData
      const { name, logo } = profileData

      if (currentPrice && openPrice) {
        const percentageChange = calculatePercentageChange(openPrice, currentPrice)
        stockChanges.push({
          symbol,
          name,
          logo,
          currentPrice,
          change: percentageChange,
        })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch stock changes: ' + error }, { status: 500 })
    }
  }

  stockChanges.sort((a, b) => b.change - a.change)

  const topGainers = stockChanges.filter((item) => item.change > 0)
  const topLosers = stockChanges.filter((item) => item.change < 0)

  // Remove duplicates if necessary
  const topGainersSymbols = new Set(topGainers.map((stock) => stock.symbol))
  const distinctTopLosers = topLosers.filter((stock) => !topGainersSymbols.has(stock.symbol))

  return {
    topGainers: formatStockChanges(topGainers),
    topLosers: formatStockChanges(distinctTopLosers),
  }
}

export async function GET() {
  try {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA', 'FTEL', 'AIRJ', 'FARM']
    const result = await getStockChanges(symbols)
    return NextResponse.json(result)
  } catch (error) {
    Logger.error('Failed to fetch top gainers and losers' + error)
    return NextResponse.json({ error: 'Failed to fetch top gainers and losers: ' + error }, { status: 500 })
  }
}
