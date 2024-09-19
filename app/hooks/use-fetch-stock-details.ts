import { useQuery } from '@tanstack/react-query'
import { fetchStockDetails } from '../queries/stock-details'

export function useFetchStockDetails(symbol: string) {
  return useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetails(symbol),
    enabled: !!symbol,
  })
}
