import { addToWatchlist, removeFromWatchlist } from "../queries/watchlist";
import useAuthenticatedMutation from "./use-authenticated-mutation";

export const useRemoveFromWatchlist = ({ stockId }) => {
  return useAuthenticatedMutation({
    mutationFn: (stockId) => removeFromWatchlist(stockId),
    onSuccess: () => {
      // Handle success, e.g., show a success message or update the UI
      console.log("Item added to watchlist successfully.");
    },
    onError: (error) => {
      console.error("Error adding item to watchlist:", error);
    },
  });
};
