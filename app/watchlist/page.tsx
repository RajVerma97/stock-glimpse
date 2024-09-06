"use client";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import StockCard from "@/components/StockCard";
import SpinnerManager from "@/components/SpinnerManager";
import ErrorMessage from "@/components/Error";
import { useGetWatchlist } from "../hooks/use-get-watch-list";

function Watchlist() {
  // Use SWR to fetch data from the API route
  const { data, error, isLoading } = useGetWatchlist();

  // Check loading state
  if (!data && !error) return <SpinnerManager isLoading={isLoading} />;

  // Handle error state
  if (error) console.log(error);

  // Handle case where data might be undefined
  const watchlist = data?.watchlist || []; // Default to an empty array if data is undefined

  // Render fetched data
  return (
    <div>
      <h1 className="text-2xl text-center mb-4">Your Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {watchlist.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      ) : (
        <p>Your watchlist is empty.</p>
      )}
    </div>
  );
}

export default Watchlist;
