"use client";
import { TimeFrame } from "@/app/enums/StockPriceChart.enum";
import { useFetchHistoricalData } from "@/app/hooks/use-fetch-historical-data";
import { useFetchStockDetails } from "@/app/hooks/use-fetch-stock-details";
import { HistoricalData, Stock } from "@/app/types/stock-detail";
import { formatDate } from "@/app/utils/dateFormat";
import ErrorMessage from "@/components/Error";
import Loading from "@/components/Loading";
import RatioChart from "@/components/RatioChart";
import ShareholdingPatternChart from "@/components/ShareHoldingPatternChart";
import StockPriceChart from "@/components/StockPriceChart";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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

  return (
    <div className="w-full p-8 grid gap-5">
      <div className="mb-5 flex gap-5">
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
          <CardFooter>Data last updated at {formatDate(new Date())}</CardFooter>
        </Card>

        <div className="w-full h-[600px] mt-4">
          {historicalData && historicalData.length > 0 && (
            <StockPriceChart
              historicalData={historicalData}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
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
