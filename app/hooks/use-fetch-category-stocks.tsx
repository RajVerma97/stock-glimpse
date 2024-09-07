import { useQuery } from "@tanstack/react-query";
import fetchCategoryStocks from "../queries/fetch-category-stocks";

export function useFetchCategoryStocks(category: string) {
  return useQuery({
    queryKey: ["category-stock", category],
    queryFn: () => fetchCategoryStocks(category),
  });
}
