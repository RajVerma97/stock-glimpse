import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://finnhub.io/api/v1";

// Fetch real-time price data for a given symbol
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

// Fetch stock profile (name and logo) for a given symbol
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

// Calculate percentage change
function calculatePercentageChange(open: number, close: number): number {
  return ((close - open) / open) * 100;
}

// Format stock changes to two decimal places for display
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
    change: stock.change.toFixed(2), // Format to 2 decimal places
    currentPrice: stock.currentPrice.toFixed(2), // Format currentPrice to 2 decimal places
  }));
}

// Get stock changes for multiple symbols
async function getStockChanges(symbols: string[]) {
  const stockChanges: {
    symbol: string;
    name: string;
    logo: string;
    currentPrice: number;
    change: number; // Keep as number for calculations
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

  stockChanges.sort((a, b) => b.change - a.change); // Sort descending

  const topGainers = stockChanges.slice(0, 5); // Top 5 gainers
  const topLosers = stockChanges.slice(-5).reverse(); // Top 5 losers

  return {
    topGainers: formatStockChanges(topGainers),
    topLosers: formatStockChanges(topLosers),
  };
}

// Handle GET request
export async function GET() {
  try {
    const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]; // Example symbols
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
