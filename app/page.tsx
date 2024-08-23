"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SpinnerManager from "@/components/SpinnerManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch top gainers and losers
  const fetchTopGainersAndLosers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/top-gainers-and-losers");
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${await response.text()}`
        );
      }
      const data = await response.json();
      setTopGainers(data.topGainers);
      setTopLosers(data.topLosers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopGainersAndLosers();
  }, []);

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const register = () => {
    router.push("/register");
  };

  const login = () => {
    router.push("/login");
  };

  if (loading) return <SpinnerManager isLoading={loading} />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Splash Page</h1>
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

      {/* Top Gainers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topGainers.slice(0, 5).map((stock: any) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
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

      {/* Top Losers Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Losers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLosers.slice(0, 5).map((stock: any) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
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
    </>
  );
}
