import axios from 'axios'

export async function fetchHistoricalData(symbol: string) {
  const response = await axios.get(`/api/stock-detail/${symbol}/historical/`)

  return response.data
}
