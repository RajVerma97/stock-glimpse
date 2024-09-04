"use client";

import React from "react";
import { useGetWatchlist } from "../hooks/use-get-watch-list";
import SpinnerManager from "@/components/SpinnerManager";
import useAuthenticatedQuery from "../hooks/use-authenticated-query";
import { getWatchlist } from "../queries/watchlist";

export default function Watchlist() {
  const { data, error, isLoading } = useAuthenticatedQuery(
    ["watchlist"],
    getWatchlist,
    {
      onSuccess: (data) => {
        console.log("Watchlist fetched successfully:", data);
        // Optionally show a success notification or perform other actions
      },
      onError: (error) => {
        console.error("Error fetching watchlist:", error);
        // Optionally show an error notification or perform other actions
      },
    }
  );
  console.log(data);

  return (
    <div className="p-4">
      <h1>Watchlist</h1>

      {isLoading && <SpinnerManager isLoading={isLoading} />}
    </div>
  );
}
