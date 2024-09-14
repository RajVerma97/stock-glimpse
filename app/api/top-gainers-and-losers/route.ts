import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://finnhub.io/api/v1";

async function fetchRealTimePrice(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching real-time data for ${symbol}:`, error);
    throw error;
  }
}

async function fetchStockProfile(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/stock/profile2`, {
      params: {
        symbol: symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock profile for ${symbol}:`, error);
    throw error;
  }
}

function calculatePercentageChange(open: number, close: number): number {
  return ((close - open) / open) * 100;
}

function formatStockChanges(
  changes: {
    symbol: string;
    name: string;
    logo: string;
    currentPrice: number;
    change: number;
  }[]
) {
  return changes.map((stock) => ({
    ...stock,
    change: stock.change.toFixed(2),
    currentPrice: stock.currentPrice.toFixed(2),
  }));
}

async function getStockChanges(symbols: string[]) {
  const stockChanges: {
    symbol: string;
    name: string;
    logo: string;
    currentPrice: number;
    change: number;
  }[] = [];

  for (const symbol of symbols) {
    try {
      const [priceData, profileData] = await Promise.all([
        fetchRealTimePrice(symbol),
        fetchStockProfile(symbol),
      ]);

      const { c: currentPrice, o: openPrice } = priceData;
      const { name, logo } = profileData;

      if (currentPrice && openPrice) {
        const percentageChange = calculatePercentageChange(
          openPrice,
          currentPrice
        );
        stockChanges.push({
          symbol,
          name,
          logo,
          currentPrice,
          change: percentageChange,
        });
      }
    } catch (error) {
      console.error(`Error processing data for ${symbol}:`, error);
    }
  }

  stockChanges.map((stock) => ({
    ...stock,
    change: stock.change.toFixed(2), // Format as string here
  }));

  stockChanges.sort((a, b) => b.change - a.change);

  const topGainers = stockChanges.filter((item) => item.change > 0);
  const topLosers = stockChanges.filter((item) => item.change < 0);

  // Remove duplicates if necessary
  const topGainersSymbols = new Set(topGainers.map((stock) => stock.symbol));
  const distinctTopLosers = topLosers.filter(
    (stock) => !topGainersSymbols.has(stock.symbol)
  );

  return {
    topGainers: formatStockChanges(topGainers),
    topLosers: formatStockChanges(distinctTopLosers),
  };
}

export async function GET() {
  try {
    const symbols = [
      "AAPL",
      "GOOGL",
      "MSFT",
      "AMZN",
      "TSLA",
      "META",
      "NFLX",
      "NVDA",

      "FTEL",
      "AIRJ",
      "FARM",
    ];
    const { topGainers, topLosers } = await getStockChanges(symbols);

    return NextResponse.json({ topGainers, topLosers });
  } catch (error) {
    console.error("Error getting top gainers and losers:", error);
    return NextResponse.json(
      { error: "Failed to fetch top gainers and losers" },
      { status: 500 }
    );
  }
}
