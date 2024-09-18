// hooks/useFetchCategoryStocks.ts
import { useQuery } from '@tanstack/react-query'
import fetchCategoryStocks from '../queries/fetch-category-stocks'

export function useFetchCategoryStocks(
  category: string,
  page: number,
  limit: number,
) {
  return useQuery({
    queryKey: ['category-stock', category, page, limit],
    queryFn: () => fetchCategoryStocks(category, page, limit),
  })
}
