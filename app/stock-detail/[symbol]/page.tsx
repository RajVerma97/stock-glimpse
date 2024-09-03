"use client";
import { TimeFrame } from "@/app/enums/StockPriceChart.enum";
import { useFetchHistoricalData } from "@/app/hooks/use-fetch-historical-data";
import { useFetchStockDetails } from "@/app/hooks/use-fetch-stock-details";
import { HistoricalData, Stock } from "@/app/types/stock-detail";
import { formatDate } from "@/app/utils/dateFormat";
import ErrorMessage from "@/components/Error";
import FundamentalCard from "@/components/FundamentalCard";
import Loading from "@/components/Loading";
import RatioCard from "@/components/RatioCard";
import RatioCardList from "@/components/RatioCardList";
import RatioChart from "@/components/RatioChart";
import ShareholdingPatternChart from "@/components/ShareHoldingPatternChart";
import StockPriceChart from "@/components/StockPriceChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function StockDetailPage({ params }) {
  const { symbol } = params;

  const [timeFrame, setTimeFrame] = useState<string>(TimeFrame.OneMonth);
  const [error, setError] = useState<string | null>(null);

  const {
    data: stock,
    isLoading: isStockDetailsLoading,
    isError: isStockDetailsError,
  } = useFetchStockDetails(symbol);

  const {
    data: historicalData,
    isLoading: isHistoricalDataLoading,
    isError: isHistoricalDataError,
  } = useFetchHistoricalData(symbol);

  if (isStockDetailsLoading || isHistoricalDataLoading)
    return <Loading isLoading={true} />;
  if (error) return <ErrorMessage message={error} />;

  if (!stock) return <ErrorMessage message="No stock details available" />;

  // const addToWatchList = async () => {};
  console.log(stock)

  return (
    <div className="w-full p-10 grid gap-[5rem]">
      <div className=" block sm:block md:flex  gap-20 sm:gap-10">
        <FundamentalCard stock={stock} />

        <div className="w-full sm:w-1/2 h-[500px]">
          {historicalData && historicalData.length > 0 && (
            <StockPriceChart
              historicalData={historicalData}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
          )}
        </div>
      </div>
      <div className="w-full">
        <h1>Share Holding Pattern</h1>
        {stock.shareholdingPattern && (
          <ShareholdingPatternChart data={stock.shareholdingPattern} />
        )}
      </div>

      <RatioCardList stock={stock} />

      <div className="w-full  ">
        <RatioChart ratios={stock.ratios} />
      </div>
    </div>
  );
}
