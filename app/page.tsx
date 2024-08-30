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

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="grid gap-8">
      <div>
        <SearchStocks />
        <MarketStatus />
      </div>

      <div className="mb-4"></div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IsTopGainersAndLosersLoading ? (
            <Loading isLoading={IsTopGainersAndLosersLoading} />
          ) : (
            topGainers?.slice(0, 5).map((stock: any) => (
              <Link
                key={stock.symbol}
                href={`/stock-detail/${stock.symbol}`}
                className="block"
              >
                <Card className="shadow-md p-4 border rounded-lg cursor-pointer">
                  <CardHeader className="flex items-center">
                    <img
                      src={stock.logo}
                      alt={`${stock.name} logo`}
                      className="w-12 h-12 mr-4"
                    />
                    <div>
                      <CardTitle className="text-xl font-medium">
                        {stock.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-white">${stock.currentPrice}</p>
                    <p
                      className={`text-lg ${
                        stock.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.change}%
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Losers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLosers?.slice(0, 5).map((stock: any) => (
            <Link
              key={stock.symbol}
              href={`/stock-detail/${stock.symbol}`}
              className="block"
            >
              <Card className="shadow-md p-4 border rounded-lg cursor-pointer">
                <CardHeader className="flex items-center">
                  <img
                    src={stock.logo}
                    alt={`${stock.name} logo`}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <CardTitle className="text-xl font-medium">
                      {stock.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-white">${stock.currentPrice}</p>
                  <p
                    className={`text-lg ${
                      stock.change > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stock.change}%
                  </p>
                </CardContent>
              </Card>
            </Link>
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
