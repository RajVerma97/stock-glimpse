// import { useQuery } from "@tanstack/react-query";
import { useQuery } from '@tanstack/react-query'
import { fetchMarketIndex } from '../queries/market-index'

export function useFetchMarketIndex(symbol: string) {
  return useQuery({
    queryKey: ['fetch-market-index', symbol],
    queryFn: () => fetchMarketIndex(symbol),
    enabled: !!symbol,
  })
}
