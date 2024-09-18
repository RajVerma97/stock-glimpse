import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalData } from '../queries/historical-data'

export function useFetchHistoricalData(symbol: string) {
  return useQuery({
    queryKey: ['historical-data', symbol],
    queryFn: () => fetchHistoricalData(symbol),
    // staleTime: 60000,
  })
}
