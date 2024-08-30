import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "../queries/search-stocks";

export function useSearchStocks(searchParams: string) {
  return useQuery({
    queryKey: ["search", searchParams],
    queryFn: () => searchStocks(searchParams),
    enabled: !!searchParams,
  });
}
