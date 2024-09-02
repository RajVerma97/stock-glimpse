import React from "react";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { formatDate } from "@/app/utils/dateFormat";
import Image from "next/image";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAddToWatchListMutation } from "@/app/hooks/use-add-to-watchlist";
// import { useAddToWatchListMutation } from "@/app/hooks/use-add-to-watchlist";

export default function FundamentalCard({ stock }) {
  const addToWatchListMutation = useAddToWatchListMutation();

  const handleAddToWatchList = () => {
    addToWatchListMutation.mutate(stock.symbol);
  };
  return (
    <div className="">
      <Card className="w-full p-2 mb-10 md:mb-0">
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
          <Button onClick={handleAddToWatchList}>Add to watchlist</Button>
        </div>
      </Card>
    </div>
  );
}
