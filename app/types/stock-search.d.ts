export interface StockData {
  ticker: string
  name: string
  market: string
  locale: string
  primary_exchange: string
  type: string
  active: boolean
  currency_name: string
  last_updated_utc: string
  logo?: string | null
}

export interface FinnhubLogoResponse {
  logo?: string
}
