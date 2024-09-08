import { notify } from "@/components/ToastManager";
import { removeFromWatchlist } from "../queries/watchlist";
import useAuthenticatedMutation from "./use-authenticated-mutation";
import { useQueryClient } from "@tanstack/react-query";

export default function useRemoveFromWatchlist(symbol: string) {
  const queryClient = useQueryClient(); // Access the query client

  return useAuthenticatedMutation({
    mutationFn: (symbol: string) => removeFromWatchlist(symbol),

    onSuccess: (data) => {
      // Handle success, e.g., show a success message or update the UI
      console.log("Item removed from watchlist successfully.");

      // Invalidate and refetch the get-watchlist query
      queryClient.invalidateQueries({ queryKey: ["get-watchlist"] });

      notify({
        message: data?.message || "Stock Removed from Watchlist Successfully",
        status: "success",
      });
    },

    onError: (error) => {
      const errorMessage = error?.response?.data?.message;
      notify({
        message: errorMessage || "Something went wrong",
        status: "error",
      });
    },
  });
}
