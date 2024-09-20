import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { FinnhubLogoResponse, StockData } from '../../../types/stock-search'

export async function GET(req: NextRequest, context: { params: { searchParams: string } }) {
  const searchParams = context.params.searchParams

  if (!searchParams) {
    return NextResponse.json({ error: 'No search parameter provided' }, { status: 400 })
  }

  try {
    const apiUrl = `https://api.polygon.io/v3/reference/tickers?search=${searchParams}&apiKey=${process.env.POLYGON_API_KEY}`
    const response = await axios.get(apiUrl)

    if (response.data && response.data.results) {
      const results: StockData[] = response.data.results
      const resultsWithLogos: StockData[] = []

      for (const stock of results) {
        try {
          const logoResponse = await axios.get<FinnhubLogoResponse>(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${stock.ticker}&token=${process.env.FINNHUB_API_KEY}`,
          )
          resultsWithLogos.push({
            ...stock,
            logo: logoResponse.data.logo || null,
          })
        } catch {
          resultsWithLogos.push({
            ...stock,
            logo: null,
          })
        }
      }

      const formattedData: StockData[] = resultsWithLogos.map((stock) => ({
        ticker: stock.ticker,
        name: stock.name,
        market: stock.market,
        locale: stock.locale,
        primary_exchange: stock.primary_exchange,
        type: stock.type,
        active: stock.active,
        currency_name: stock.currency_name,
        last_updated_utc: stock.last_updated_utc,
        logo: stock.logo,
      }))

      return NextResponse.json(formattedData)
    } else {
      return NextResponse.json({ error: 'No results found' }, { status: 404 })
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json({ error: error.response.data.error || error.message }, { status: error.response.status })
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
    }
  }
}
