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

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchParams, setSearchParams] = useState<string>("");
  const debouncedSearchParams = useDebounce(searchParams, 400);

  const {
    data: stockSearchData,
    isLoading: isStockSearchLoading,
    isError: isStockSearchError,
  } = useSearchStocks(debouncedSearchParams);

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

  if (isStockSearchError) {
    return <ErrorMessage message="Error loading stocks" />;
  }

  return (
    <div className="grid gap-8">
      <div>
        <Command className="rounded-lg border shadow-md md:min-w-[450px] bg-white text-black focus:border-blue-300">
          <CommandInput
            className="text-3xl p-3 "
            placeholder="Search for stocks...."
            value={searchParams}
            onValueChange={(value) => setSearchParams(value)}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            {isStockSearchLoading ? (
              <div className="flex justify-center items-center p-4">
                <MoonLoader
                  color="black"
                  loading={isStockSearchLoading}
                  size={25}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <>
                {debouncedSearchParams && stockSearchData?.length === 0 && (
                  <CommandEmpty className="text-center p-4 text-gray-500">
                    No results found.
                  </CommandEmpty>
                )}
                {debouncedSearchParams && stockSearchData?.length > 0 && (
                  <div className="p-4 space-y-2">
                    {stockSearchData.map((stock: any) => (
                      <div
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        key={stock.ticker}
                        onClick={() =>
                          router.push(`/stock-detail/${stock.ticker}`)
                        }
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                          {stock.logo ? (
                            <Image
                              width={100}
                              height={100}
                              src={stock.logo}
                              alt={`${stock.name} logo`}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600 text-xl">
                              {stock.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="ml-3 text-lg font-semibold">
                          {stock.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>

      <div className="mb-4">
        <Button variant="link" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="link" className="ml-4">
          <Link href="/register">Register</Link>
        </Button>
      </div>
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
