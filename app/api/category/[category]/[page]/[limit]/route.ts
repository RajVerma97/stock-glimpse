import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { StockCategoriesData } from '../../../../../data/stock-categories-data'
import Logger from '../../../../../../lib/winstonLogger'
import { StockCategoriesList } from '../../../../../enums/stock-categories-list.enum'

const fetchStockDetailBySymbol = async (symbol: string) => {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) {
    Logger.error('FINNHUB_API_KEY is not set')
    throw new Error('API key missing')
  }

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`

  try {
    const [quoteResponse, profileResponse] = await Promise.all([axios.get(quoteUrl), axios.get(profileUrl)])

    const stockDetail = {
      currentPrice: quoteResponse.data?.c || null,
      changeInPrice: quoteResponse.data?.d || null,
      percentageChange: quoteResponse.data?.dp || null,
      highPriceOfDay: quoteResponse.data?.h || null,
      lowPriceOfDay: quoteResponse.data?.l || null,
      openingPrice: quoteResponse.data?.o || null,
      previousClosePrice: quoteResponse.data?.pc || null,
      timestamp: quoteResponse.data?.t || null,
      companyName: profileResponse.data?.name || 'No name available',
      symbol: profileResponse.data?.ticker || symbol,
      description: profileResponse.data?.description || 'No description available',
      industry: profileResponse.data?.finnhubIndustry || 'Unknown',
      country: profileResponse.data?.country || 'Unknown',
      logo: profileResponse.data?.logo || null,
    }

    return stockDetail
  } catch (error) {
    Logger.error(`Error fetching stock detail for ${symbol}:`, (error as Error).message)
    throw error
  }
}

// GET handler for stock details based on market cap category
export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  const { category } = params

  if (!category) {
    return NextResponse.json({ message: 'No category provided' }, { status: 400 })
  }

  try {
    const normalizedCategory = category.toUpperCase() as keyof typeof StockCategoriesList

    if (!(normalizedCategory in StockCategoriesList)) {
      return NextResponse.json({ message: 'Invalid category provided' }, { status: 400 })
    }

    const categoryEnumValue = StockCategoriesList[normalizedCategory]

    if (!(categoryEnumValue in StockCategoriesData)) {
      return NextResponse.json({ message: 'Invalid category provided' }, { status: 400 })
    }

    const stockSymbolsByCategory = StockCategoriesData[categoryEnumValue]
    const maxStocks = 8
    const maxStocksSymbols = stockSymbolsByCategory.slice(0, maxStocks)
    const stocks = await Promise.all(maxStocksSymbols.map((symbol) => fetchStockDetailBySymbol(symbol)))
    console.log(stocks)

    return NextResponse.json(stocks)
  } catch (error) {
    Logger.error('Error fetching stock details:', (error as Error).message)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
