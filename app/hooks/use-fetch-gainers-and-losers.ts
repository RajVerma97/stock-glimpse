import { useQuery } from "@tanstack/react-query";
import { fetchGainersAndLosers } from "../queries/gainers-and-losers";

export function useFetchGainersAndLosers() {
  return useQuery({
    queryKey: ["top-gainers-and-losers"],
    queryFn: fetchGainersAndLosers,
  });
}
