import { NextRequest, NextResponse } from 'next/server'
import { StockSymbols } from '../../../../../data/stock-symbols'
import { fetchStockDetails } from '../../../../../queries/stock-details'

// GET handler with pagination for stock details based on market cap category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; page: number; limit: number } },
) {
  const { category, page } = params

  const limit = 20

  if (!category) {
    return NextResponse.json({ message: 'No category provided' }, { status: 400 })
  }

  try {
    const symbols = StockSymbols
    const totalSymbols = symbols.length
    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, totalSymbols)

    const paginatedSymbols = symbols.slice(startIndex, endIndex)

    // Fetch stock details with rate limiting
    const stockDetailsPromises = paginatedSymbols.map(async (symbolData) => {
      // Add a delay to avoid hitting the API rate limit
      const symbol = symbolData.symbol
      const stockDetail = await fetchStockDetails(symbol)

      if (!stockDetail) return null

      const marketCap = stockDetail.marketCap || 0 // Ensure marketCap has a value

      // Adjust the cap ranges for mid and large caps
      if (category === 'small-cap' && marketCap < 1_000_000_000) {
        return stockDetail
      }
      if (category === 'mid-cap' && marketCap >= 1_000_000_000 && marketCap < 10_000_000_000) {
        return stockDetail
      }
      if (category === 'large-cap' && marketCap >= 10_000_000_000) {
        return stockDetail
      }

      return null
    })

    const stockDetails = (await Promise.all(stockDetailsPromises)).filter(Boolean)

    const totalPages = Math.ceil(totalSymbols / limit)
    const pagination = {
      currentPage: page,
      limit,
      totalPages,
      totalItems: totalSymbols,
    }

    return NextResponse.json({ stockDetails, pagination })
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching stock data' + error }, { status: 500 })
  }
}
