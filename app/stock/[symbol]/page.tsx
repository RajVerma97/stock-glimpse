"use client";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Stock {
  name: string;
  symbol: string;
  currentPrice: number;
  change: number;
  percentageChange: number;
  highPriceOfDay: number;
  lowPriceOfDay: number;
  openingPrice: number;
  previousClosePrice: number;
  timestamp: number;
  logo: string;
  companyName: string;
  industry: string;
  description: string;
  country: string;
}

export default function StockDetailPage({ params }) {
  const { symbol } = params;

  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      if (!symbol) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/stock/${symbol}`);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${await response.text()}`
          );
        }
        const data = await response.json();
        setStock(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [symbol]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stock) return <p>No data available</p>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            {stock.logo && (
              <Image
                src={stock.logo}
                alt={`${stock.companyName} logo`}
                className="w-12 h-12 mr-4"
                width={50}
                height={50}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {stock.companyName} ({stock.symbol})
              </h1>
              <p className="text-gray-500">
                Current Price: ${stock.currentPrice}
              </p>
              <p className="text-gray-500">Industry: {stock.industry}</p>
            </div>
          </div>
        </CardHeader>
        <div className="mb-4 p-5">
          <p>
            <strong>Change:</strong> {stock.change} ($
            {stock.currentPrice - stock.previousClosePrice})
          </p>
          <p>
            <strong>Percentage Change:</strong> {stock.percentageChange}%
          </p>
          <p>
            <strong>High Price of Day:</strong> ${stock.highPriceOfDay}
          </p>
          <p>
            <strong>Low Price of Day:</strong> ${stock.lowPriceOfDay}
          </p>
          <p>
            <strong>Opening Price:</strong> ${stock.openingPrice}
          </p>
          <p>
            <strong>Previous Close Price:</strong> ${stock.previousClosePrice}
          </p>
          <p>
            <strong>Description:</strong> {stock.description}
          </p>
          <p>
            <strong>country:</strong> {stock.country}
          </p>
        </div>
        <CardFooter>
          Data last updated at{" "}
          {new Date(stock.timestamp * 1000).toLocaleString()}
        </CardFooter>
      </Card>
    </div>
  );
}
