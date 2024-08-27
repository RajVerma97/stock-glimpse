import axios from "axios";


import { NextResponse } from "next/server";

interface HistoricalDataEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

async function fetchHistoricalData(
  symbol: string
): Promise<HistoricalDataEntry[]> {
  console.log("fetch historical data for symbol", symbol);

  const polygonApiKey = process.env.POLYGON_API_KEY;
  if (!polygonApiKey) {
    throw new Error("POLYGON_API_KEY is not defined");
  }

  const now = new Date();
  const interval = "1/day"; // Fixed interval of 1 day
  const startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Fetch data for the past year
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(new Date());

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${interval}/${formattedStartDate}/${formattedEndDate}?apiKey=${polygonApiKey}`;

  try {
    const response = await axios.get(url);
    console.log("response", response.data.results);

    const newData = response.data.results.map((entry: any) => ({
      date: new Date(entry.t).toISOString().split("T")[0],
      open: entry.o,
      high: entry.h,
      low: entry.l,
      close: entry.c,
      volume: entry.v,
    }));
    console.log("response.data.results", newData);
    return newData;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  try {
    const historicalData = await fetchHistoricalData(symbol);
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("GET request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
