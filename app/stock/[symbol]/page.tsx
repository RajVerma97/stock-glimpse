"use client";
import RatioChart from "@/components/RatioChart";
import ShareholdingPatternChart from "@/components/ShareHoldingPatternChart";
import StockPriceChart from "@/components/StockPriceChart";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HistoricalDataEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface HistoricalData extends HistoricalDataEntry {}

interface StockPriceChartProps {
  historicalData: HistoricalData[];
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
}

interface Shareholder {
  name: string;
  percentage: number;
}

interface ShareholdingPattern {
  symbol: string;
  promoters: Shareholder[];
  institutionalInvestors: Shareholder[];
  public: Shareholder[];
}

interface Stock {
  companyName: string;
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
  peRatio: number | null;
  bookValue: number | null;
  marketCap: number | null;
  roi: number | null;
  roe: number | null;
  roce: number | null;
  dividendYield: number | null;
  faceValue: number | null;
  numberOfShares: number | null;
  promoterHoldingPercentage: number | null;
  totalDebt: number | null;
  industry: string;
  description: string;
  country: string;
  historicalData: HistoricalData[];
  shareholdingPattern: ShareholdingPattern | null;
  ratios: any;
}

export default function StockDetailPage({ params }) {
  const { symbol } = params;

  const [stock, setStock] = useState<Stock | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<string>("1M");

  useEffect(() => {
    const fetchStockDetails = async () => {
      if (!symbol) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/stock/${symbol}/fundamental`);
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

    fetchStockDetails();
  }, [symbol]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!symbol || !timeFrame) return;
      setChartLoading(true);
      try {
        const response = await fetch(
          `/api/stock/${symbol}/${timeFrame}/historical/`
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${await response.text()}`
          );
        }
        const data = await response.json();
        setHistoricalData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setChartLoading(false);
      }
    };

    fetchHistoricalData();
  }, [symbol, timeFrame]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stock) return <p>No data available</p>;

  return (
    <div className="w-full p-8 grid gap-5">
      <div className="mb-5  flex  gap-5">
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
              <strong>Country:</strong> {stock.country}
            </p>
            <p>
              <strong>PE Ratio:</strong> {stock.peRatio ?? "N/A"}
            </p>
            <p>
              <strong>Book Value:</strong> {stock.bookValue ?? "N/A"}
            </p>
            <p>
              <strong>Market Cap:</strong> {stock.marketCap ?? "N/A"}
            </p>
            <p>
              <strong>ROI:</strong> {stock.roi ?? "N/A"}
            </p>
            <p>
              <strong>ROE:</strong> {stock.roe ?? "N/A"}
            </p>
            <p>
              <strong>ROCE:</strong> {stock.roce ?? "N/A"}
            </p>
            <p>
              <strong>Dividend Yield:</strong> {stock.dividendYield ?? "N/A"}
            </p>
            <p>
              <strong>Face Value:</strong> {stock.faceValue ?? "N/A"}
            </p>
            <p>
              <strong>Number of Shares:</strong> {stock.numberOfShares ?? "N/A"}
            </p>
            <p>
              <strong>Promoter Holding Percentage:</strong>{" "}
              {stock.promoterHoldingPercentage ?? "N/A"}
            </p>
            <p>
              <strong>Total Debt:</strong> {stock.totalDebt ?? "N/A"}
            </p>
          </div>
          <CardFooter>
            Data last updated at{" "}
            {new Date(stock.timestamp * 1000).toLocaleString()}
          </CardFooter>
        </Card>

        {/* Increase the width and height of the StockPriceChart */}
        <div className="w-full h-[600px] mt-4">
          {historicalData.length > 0 && (
            <StockPriceChart
              historicalData={historicalData}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              loading={chartLoading}
            />
          )}
        </div>
      </div>
      <div className="w-full h-[600px] p-10 mb-8">
        <h1>Share Holding Pattern</h1>
        {stock.shareholdingPattern && (
          <ShareholdingPatternChart data={stock.shareholdingPattern} />
        )}
      </div>
      <div className="w-full p-10 ">
        <h1>Ratios</h1>
        <RatioChart ratios={stock.ratios} />
      </div>
    </div>
  );
}
