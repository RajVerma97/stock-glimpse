import { useQuery } from "@tanstack/react-query";
import fetchStockNews from "../queries/fetch-stock-news";

export function useFetchStockNews(symbol: string) {
  return useQuery({
    queryKey: ["fetch-stock-news", symbol],
    queryFn: () => fetchStockNews(symbol),
  });
}
