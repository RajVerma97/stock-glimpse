"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MyLineChart from "@/components/MyLineChart";

export default function SplashPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stockData, setStockData] = useState<any>(null); // Use `any` for initial type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async () => {
    try {
      const response = await fetch("/api/yahoo-finance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: "RELIANCE" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      setStockData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
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

  return (
    <>
      <h1>SplashPage</h1>

      <Button variant={"link"} asChild>
        <Link href="/login">Login</Link>
      </Button>

      <Button asChild variant={"link"}>
        <Link href={"/register"} onClick={register}>
          Register
        </Link>
      </Button>

      <MyLineChart />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching stock data: {error}</p>
      ) : (
        <div>
          <h2>Reliance Stock Information</h2>
          <pre>{JSON.stringify(stockData, null, 2)}</pre>
        </div>
      )}

      {session ? (
        <Button onClick={logout} variant={"outline"}>
          Logout
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}
