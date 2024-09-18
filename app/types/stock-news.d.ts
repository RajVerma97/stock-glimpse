type NewsEntity = {
  name: string
  type: string
  relevance: number
}

type StockNews = {
  description: string
  entities: NewsEntity[]
  image_url: string
  keywords: string
  language: string
  published_at: string
  relevance_score: number | null
  similar: any[] // adjust if you know the structure
  snippet: string
  source: string
  title: string
  url: string
  uuid: string
}
