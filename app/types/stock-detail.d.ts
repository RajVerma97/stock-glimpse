export interface HistoricalDataEntry {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoricalData extends HistoricalDataEntry {}

export interface StockPriceChartProps {
  historicalData: HistoricalData[]
  timeFrame: string
  setTimeFrame: (timeFrame: string) => void
}

export interface Shareholder {
  name: string
  percentage: number
}

export interface ShareholdingPattern {
  symbol: string
  promoters: Shareholder[]
  institutionalInvestors: Shareholder[]
  public: Shareholder[]
}

export interface Stock {
  companyName: string
  symbol: string
  currentPrice: number
  change?: number
  percentageChange?: number
  highPriceOfDay?: number
  lowPriceOfDay?: number
  openingPrice?: number
  previousClosePrice?: number
  timestamp?: number
  logo?: string
  peRatio?: number
  bookValue?: number
  marketCap?: number
  roi?: number
  roe?: number
  roce?: number
  dividendYield?: number
  faceValue?: number
  numberOfShares?: number
  promoterHoldingPercentage?: number
  totalDebt?: number
  industry: string
  description?: string
  country?: string
  historicalData?: any
  shareholdingPattern?: ShareholdingPattern
  ratios?: any
  debtToEquityRatio?: number
  epsTTM?: number
}

export interface RatioItem {
  period: string
  v: number
}

export interface RatioData {
  [key: string]: RatioItem[]
}
