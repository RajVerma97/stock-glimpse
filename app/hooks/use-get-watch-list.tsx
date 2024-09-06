import { getWatchlist } from "../queries/watchlist";
import useAuthenticatedQuery from "./use-authenticated-query";

export function useGetWatchlist() {
  return useAuthenticatedQuery(["watchlist"], () => getWatchlist(), {
    onSuccess: (data) => {
      // Handle successful fetch
      console.log("Fetched watchlist successfully:", data);
    },
    onError: (error) => {
      // Handle error case
      console.error("Error fetching watchlist:", error);
      // You can trigger a toast notification, log to a service, or handle the error accordingly
    },
  });
}
