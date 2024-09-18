import axios from 'axios'
import { NextResponse } from 'next/server'

interface Shareholder {
  name: string
  percentage: number
}

interface ShareholdingPattern {
  symbol: string
  promoters: Shareholder[]
  institutionalInvestors: Shareholder[]
  public: Shareholder[]
}

interface HistoricalDataEntry {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

function generateRandomShareholder(namePrefix: string): Shareholder {
  return {
    name: `${namePrefix} Shareholder ${Math.floor(Math.random() * 100)}`,
    percentage: parseFloat((Math.random() * 100).toFixed(2)), // Random percentage between 0 and 100
  }
}

async function fetchShareholdingPattern(
  symbol: string,
): Promise<ShareholdingPattern> {
  // Mock data for demonstration
  const mockData = {
    promoters: Array.from({ length: 3 }, () =>
      generateRandomShareholder('Promoter'),
    ),
    institutionalInvestors: Array.from({ length: 5 }, () =>
      generateRandomShareholder('Institutional'),
    ),
    public: Array.from({ length: 10 }, () =>
      generateRandomShareholder('Public'),
    ),
  }

  return {
    symbol,
    ...mockData,
  }
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } },
) {
  const { symbol } = params

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
  const fundamentalsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`

  try {
    const [
      quoteResponse,
      fundamentalsResponse,
      profileResponse,
      shareholdingResponse,
    ] = await Promise.all([
      axios.get(quoteUrl),
      axios.get(fundamentalsUrl),
      axios.get(profileUrl),
      fetchShareholdingPattern(symbol),
    ])

    const peRatio = fundamentalsResponse.data.metric.peAnnual
    const roi = fundamentalsResponse.data.metric.roiTTM || null
    const roe = fundamentalsResponse.data.metric.roeTTM || null
    const roce = fundamentalsResponse.data.metric.roceTTM || null
    const divYield =
      fundamentalsResponse.data.metric.dividendPerShareTTM || null
    const faceValue = fundamentalsResponse.data.metric.faceValue || null
    const numberOfShares =
      fundamentalsResponse.data.metric.numberOfShares || null
    const promoterHoldingPercentage = shareholdingResponse.promoters.reduce(
      (total, shareholder) => total + shareholder.percentage,
      0,
    )

    const totalDebt =
      fundamentalsResponse.data.metric['totalDebt/totalEquityAnnual'] || null

    const stockDetail = {
      currentPrice: quoteResponse.data.c,
      changeInPrice: quoteResponse.data.d,
      percentageChange: quoteResponse.data.dp,
      highPriceOfDay: quoteResponse.data.h,
      lowPriceOfDay: quoteResponse.data.l,
      openingPrice: quoteResponse.data.o,
      previousClosePrice: quoteResponse.data.pc,
      timestamp: quoteResponse.data.t,
      peRatio: peRatio !== null ? parseFloat(peRatio) : null,
      bookValue: fundamentalsResponse.data.metric.ptbvAnnual,
      marketCap: fundamentalsResponse.data.metric.marketCapitalization,
      roi: roi,
      roe: roe,
      dividendYield: divYield,
      faceValue: faceValue,
      numberOfShares: numberOfShares,
      promoterHoldingPercentage: promoterHoldingPercentage,
      totalDebt: totalDebt,
      companyName: profileResponse.data.name,
      symbol: profileResponse.data.ticker,
      description:
        profileResponse.data.description || 'No description available',
      industry: profileResponse.data.finnhubIndustry,
      country: profileResponse.data.country,
      logo: profileResponse.data.logo,
      shareholdingPattern: shareholdingResponse,
      debtToEquityRatio:
        fundamentalsResponse.data.metric['longTermDebt/equityAnnual'],
      epsTTM: fundamentalsResponse.data.metric.epsTTM,
      ratios: {
        bookValue: fundamentalsResponse.data.series.annual.bookValue,
        roic: fundamentalsResponse.data.series.annual.roic,
        roe: fundamentalsResponse.data.series.annual.roe,
        pe: fundamentalsResponse.data.series.annual.pe,
        totalDebtToEquity:
          fundamentalsResponse.data.series.annual.totalDebtToEquity,
        operatingMargin:
          fundamentalsResponse.data.series.annual.operatingMargin,
      },
    }

    return NextResponse.json(stockDetail)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.error || error.message },
        { status: error.response.status },
      )
    } else {
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 },
      )
    }
  }
}
