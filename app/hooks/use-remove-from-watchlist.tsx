import { useQueryClient } from "@tanstack/react-query";
import { addToWatchlist, removeFromWatchlist } from "../queries/watchlist";
import useAuthenticatedMutation from "./use-authenticated-mutation";

export const useRemoveFromWatchlist = (symbol: string) => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation({
    mutationFn: () => removeFromWatchlist(symbol),
    onSuccess: () => {
      // Handle success, e.g., show a success message or update the UI
      console.log("Stock removed from watchlist successfully.");
      queryClient.invalidateQueries({ queryKey: ["get-watchlist"] });
    },
    onError: (error) => {
      console.error("Error removing Stock from watchlist:", error);
    },
  });
};
