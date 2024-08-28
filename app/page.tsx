"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SpinnerManager from "@/components/SpinnerManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/Loading";
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
import axios from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { SearchData } from "./types/splash-page";
import { useFetchGainersAndLosers } from "./hooks/useFetchGainersAndLosers";
import { useFetchHistoricalData } from "./hooks/useFetchHistoricalData";
import { useSearchStocks } from "./hooks/useSearchStocks";
import { useFetchStockDetails } from "./hooks/useFetchStockDetails";
import { symlink } from "fs";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<string>("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

  const {
    data: stockSearchData,
    isLoading: isStockSearchLoading,
    isError: isStockSearchError,
  } = useSearchStocks(searchParams);

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

  const register = () => {
    router.push("/register");
  };

  const login = () => {
    router.push("/login");
  };

  if (loading) return <Loading isLoading={loading} />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-bold mb-4 ">Splash Page</h1>

      <div>
        <h1 className="text-3xl">Search stock</h1>
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput
            placeholder="Type a command or search..."
            value={searchParams}
            onValueChange={(value) => setSearchParams(value)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {searchData?.map((stock: any) => (
                <CommandItem
                  key={stock.symbol}
                  onClick={() => router.push(`/stock-detail/${stock.symbol}`)}
                >
                  <span>{stock.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>

      <div className="mb-4">
        <Button variant="link" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="link" className="ml-4">
          <Link href="/register" onClick={register}>
            Register
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topGainers?.slice(0, 5).map((stock: any) => (
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
