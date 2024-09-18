export interface NewsArticle {
  category: string // Category of the news (e.g., "top news")
  datetime: number // Timestamp of the news article
  headline: string // Headline of the news article
  id: number // Unique ID of the news article
  image: string // URL of the image associated with the news article
  related: string // Related stock or topic, if any
  source: string // Source of the news (e.g., "MarketWatch")
  summary: string // Summary or description of the news article
  url: string // URL of the full news article
}
