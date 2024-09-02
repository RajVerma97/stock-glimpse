import { addToWatchlist } from "../queries/watchlist";
import useAuthenticatedMutation from "./use-authenticated-mutation";

export const useAddToWatchListMutation = () => {
  return useAuthenticatedMutation({
    mutationFn: (stockId: string) => addToWatchlist(stockId),
    onSuccess: () => {
      console.log("Item added to watchlist successfully.");
    },
    onError: (error) => {
      console.error("Error adding item to watchlist:", error);
    },
  });
};
