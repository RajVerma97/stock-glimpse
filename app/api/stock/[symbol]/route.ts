import axios from "axios";
import { NextResponse } from "next/server";
import { TimeFrame } from "./[timeFrame]/historical/route";

interface HistoricalDataEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface HistoricalDataResponse {
  results: HistoricalDataEntry[];
}

interface Shareholder {
  name: string;
  percentage: number; // Percentage of shares held
}

interface ShareholdingPattern {
  symbol: string;
  promoters: Shareholder[];
  institutionalInvestors: Shareholder[];
  public: Shareholder[];
}

interface HistoricalDataEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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
  const polygonApiKey = process.env.POLYGON_API_KEY;

  // Get the current date
  const now = new Date();
  let startDate: string;

  // Calculate start date based on the time frame
  switch (timeFrame) {
    case TimeFrame.OneDay:
      startDate = formatDate(now);
      break;
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
      date: new Date(entry.t).toISOString().split("T")[0], // Convert timestamp to YYYY-MM-DD
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

// Helper function to format Date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateRandomShareholdingPattern(
  symbol: string
): ShareholdingPattern {
  const createRandomShareholders = (
    namePrefix: string,
    num: number
  ): Shareholder[] => {
    const shareholders: Shareholder[] = [];
    let remainingPercentage = 100;

    for (let i = 0; i < num; i++) {
      const name = `${namePrefix} ${i + 1}`;
      const percentage =
        i === num - 1
          ? remainingPercentage
          : parseFloat((Math.random() * remainingPercentage).toFixed(2));
      remainingPercentage -= percentage;

      shareholders.push({ name, percentage });

      if (remainingPercentage <= 0) break;
    }

    if (remainingPercentage > 0 && shareholders.length > 0) {
      shareholders[shareholders.length - 1].percentage += remainingPercentage;
    }

    return shareholders;
  };

  return {
    symbol, // Include the symbol here
    promoters: createRandomShareholders("Promoter", 2),
    institutionalInvestors: createRandomShareholders(
      "Institutional Investor",
      2
    ),
    public: createRandomShareholders("Public", 1),
  };
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string; timeFrame: TimeFrame } }
) {
  const { symbol, timeFrame } = params;

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const fundamentalsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const [
      quoteResponse,
      fundamentalsResponse,
      profileResponse,
      historicalData,
    ] = await Promise.all([
      axios.get(quoteUrl),
      axios.get(fundamentalsUrl),
      axios.get(profileUrl),
      fetchHistoricalData(symbol, timeFrame),
    ]);

    const stockDetail = {
      currentPrice: quoteResponse.data.c,
      changeInPrice: quoteResponse.data.d,
      percentageChange: quoteResponse.data.dp,
      highPriceOfDay: quoteResponse.data.h,
      lowPriceOfDay: quoteResponse.data.l,
      openingPrice: quoteResponse.data.o,
      previousClosePrice: quoteResponse.data.pc,
      timestamp: quoteResponse.data.t,
      peRatio: fundamentalsResponse.data.metric.peRatio,
      bookValue: fundamentalsResponse.data.metric.bookValue,
      marketCap: fundamentalsResponse.data.metric.marketCap,
      companyName: profileResponse.data.name,
      symbol: profileResponse.data.ticker,
      description:
        profileResponse.data.description || "No description available",
      industry: profileResponse.data.finnhubIndustry,
      country: profileResponse.data.country,
      logo: profileResponse.data.logo,
      historicalData,
      shareHoldingPattern: generateRandomShareholdingPattern(symbol),
    };

    return NextResponse.json(stockDetail);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.error || error.message },
        { status: error.response.status }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
