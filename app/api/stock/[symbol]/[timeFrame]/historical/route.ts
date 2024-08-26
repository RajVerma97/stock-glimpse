import axios from "axios";
export enum TimeFrame {
  OneDay = "1D",
  OneWeek = "1W",
  OneMonth = "1M",
  OneYear = "1Y",
}

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
  symbol: string,
  timeFrame: TimeFrame
): Promise<HistoricalDataEntry[]> {
  if (timeFrame === TimeFrame.OneDay) {
    // Generate random data for 1D time frame
    return generateRandomHistoricalData();
  }

  const polygonApiKey = process.env.POLYGON_API_KEY;

  const now = new Date();
  let startDate: string;

  switch (timeFrame) {
    case TimeFrame.OneWeek:
      now.setDate(now.getDate() - 7);
      startDate = formatDate(now);
      break;
    case TimeFrame.OneMonth:
      now.setMonth(now.getMonth() - 1);
      startDate = formatDate(now);
      break;
    case TimeFrame.OneYear:
      now.setFullYear(now.getFullYear() - 1);
      startDate = formatDate(now);
      break;
    default:
      throw new Error("Invalid time frame");
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${formatDate(
    new Date()
  )}?apiKey=${polygonApiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results.map((entry: any) => ({
      date: new Date(entry.t).toISOString().split("T")[0],
      open: entry.o,
      high: entry.h,
      low: entry.l,
      close: entry.c,
      volume: entry.v,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
}

function generateRandomHistoricalData(): HistoricalDataEntry[] {
  const now = new Date();
  const baseDate = formatDate(now);

  // Generate random data for one day
  const randomData: HistoricalDataEntry = {
    date: baseDate,
    open: parseFloat((Math.random() * 100).toFixed(2)),
    high: parseFloat((Math.random() * 100).toFixed(2)),
    low: parseFloat((Math.random() * 100).toFixed(2)),
    close: parseFloat((Math.random() * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 100000),
  };

  return [randomData];
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string; timeFrame: TimeFrame } }
) {
  const { symbol, timeFrame } = params;

  try {
    const historicalData = await fetchHistoricalData(symbol, timeFrame);
    return NextResponse.json(historicalData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
