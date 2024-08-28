import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalData } from "../queries/historical-data";
import { fetchStockDetails } from "../queries/stock-details";

export function useFetchStockDetails(symbol: string) {
  return useQuery({
    queryKey: ["stock-details"],
    queryFn: () => fetchStockDetails(symbol),
  });
}
