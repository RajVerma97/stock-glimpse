import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalData } from "../queries/historical-data";

export function useFetchHistoricalData(symbol: string) {
  return useQuery({
    queryKey: ["historical-data"],
    queryFn: () => fetchHistoricalData(symbol),
  });
}
