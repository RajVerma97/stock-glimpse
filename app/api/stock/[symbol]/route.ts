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

interface HistoricalDataResponse {
  historicalData: HistoricalDataEntry[];
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

function generateRandomHistoricalData(numDays: number): HistoricalDataResponse {
  const historicalData: HistoricalDataEntry[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - numDays);

  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split("T")[0];

    const open = parseFloat((Math.random() * 1000 + 3000).toFixed(2));
    const high = parseFloat((open + Math.random() * 50).toFixed(2));
    const low = parseFloat((open - Math.random() * 50).toFixed(2));
    const close = parseFloat((low + Math.random() * (high - low)).toFixed(2));
    const volume = Math.floor(Math.random() * 5000000 + 1000000);

    historicalData.push({
      date: dateString,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return { historicalData };
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
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const fundamentalsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    const [quoteResponse, fundamentalsResponse, profileResponse] =
      await Promise.all([
        axios.get(quoteUrl),
        axios.get(fundamentalsUrl),
        axios.get(profileUrl),
      ]);

    const historicalData = generateRandomHistoricalData(365).historicalData; // Generate data for 1 year

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
