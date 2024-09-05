"use client";
import Link from "next/link";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading"; // Ensure this component shows a spinner
import ErrorMessage from "@/components/Error";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearchStocks } from "./hooks/use-search-stocks";
import useDebounce from "./hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchGainersAndLosers } from "./hooks/use-fetch-gainers-and-losers";
import Image from "next/image";
import { MoonLoader } from "react-spinners";
import SearchStocks from "@/components/SearchStocks";
import { motion } from "framer-motion";
import StockCard from "@/components/StockCard";
import { useFetchMarketIndex } from "./hooks/use-fetch-market-index";
import MarketIndex from "@/components/MarketIndex";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: topGainersAndLosersData,
    isLoading: IsTopGainersAndLosersLoading,
    isError: topGainersAndLosersIsError,
  } = useFetchGainersAndLosers();

  const topGainers = topGainersAndLosersData?.topGainers;
  const topLosers = topGainersAndLosersData?.topLosers;

  const {
    data: marketIndexInfo,
    isLoading: isMarketIndexInfoLoading,
    isError: isMarketIndexInfoError,
  } = useFetchMarketIndex("SPY");

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="grid gap-8">
      <h1>Stock Glimpse</h1>

      <SearchStocks />
      <MarketIndex />

      <div className="mb-4"></div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {IsTopGainersAndLosersLoading ? (
            <Loading isLoading={IsTopGainersAndLosersLoading} />
          ) : (
            topGainers
              ?.slice(0, 5)
              .map((stock: any) => <StockCard stock={stock} />)
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Losers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {topLosers?.slice(0, 5).map((stock: any) => (
            <StockCard stock={stock} />
          ))}
        </div>
      </div>

      {session ? (
        <Button onClick={logout} variant="outline" className="mt-4">
          Logout
        </Button>
      ) : null}
    </div>
  );
}
