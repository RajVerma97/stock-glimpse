import { useQuery } from "@tanstack/react-query";
import fetchMarketNews from "../queries/fetch-market-news";

export function useFetchMarketNews() {
  return useQuery({
    queryKey: ["fetch-market-news"],
    queryFn: () => fetchMarketNews(),
  });
}
