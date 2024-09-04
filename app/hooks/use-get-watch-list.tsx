import { useQuery } from "@tanstack/react-query";
import { getWatchlist } from "../queries/watchlist";
import useAuthenticatedMutation from "./use-authenticated-mutation";
import useAuthenticatedQuery from "./use-authenticated-query";

export function useGetWatchlist() {
  return useAuthenticatedQuery(["watchlist"], getWatchlist, {
    onSuccess: (data) => {
      console.log("Watchlist data:", data);
    },
    onError: (error) => {
      console.error("Error fetching watchlist:", error);
    },
  });
}
