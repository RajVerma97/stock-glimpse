import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import NodeCache from "node-cache";
import { StockSymbols } from "../../../data/stock-symbols";

// Define the types for Finnhub API responses

// Interface for stock symbols
interface StockSymbol {
  symbol: string;
  description: string;
  type: string;
  displaySymbol: string;
}

// Interface for quote response
interface QuoteResponse {
  c: number; // current price
  d: number; // change in price
  dp: number; // percentage change
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // opening price
  pc: number; // previous close price
  t: number; // timestamp
}

// Interface for fundamentals response
interface FundamentalsResponse {
  metric: {
    marketCapitalization: number;
  };
}

// Interface for profile response
interface ProfileResponse {
  name: string;
  ticker: string;
  description: string;
  finnhubIndustry: string;
  country: string;
  logo: string;
}

// Combine all data into a single stock detail type
interface StockDetail {
  currentPrice: number;
  changeInPrice: number;
  percentageChange: number;
  highPriceOfDay: number;
  lowPriceOfDay: number;
  openingPrice: number;
  previousClosePrice: number;
  timestamp: number;

  marketCap: number;

  companyName: string;
  symbol: string;
  description: string;
  industry: string;
  country: string;
  logo: string;
}

// Initialize cache with a TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 60 * 10 });

// Delay function for rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch all stock symbols with caching
const fetchAllStockSymbols = async (): Promise<StockSymbol[]> => {
  const cacheKey = "stock-symbols";
  const cachedData = cache.get<StockSymbol[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get<StockSymbol[]>(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.FINNHUB_API_KEY}`
    );
    cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock symbols:", error);
    throw new Error("Failed to fetch stock symbols");
  }
};

// Fetch stock details with caching and rate limiting
const fetchStockDetails = async (
  symbol: string
): Promise<StockDetail | null> => {
  await delay(1000); // Add a delay to throttle the requests

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const fundamentalsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;

  try {
    // Use caching for stock details
    const cacheKey = `stock-details-${symbol}`;
    const cachedData = cache.get<StockDetail>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [quoteResponse, fundamentalsResponse, profileResponse] =
      await Promise.all([
        axios.get<QuoteResponse>(quoteUrl),
        axios.get<FundamentalsResponse>(fundamentalsUrl),
        axios.get<ProfileResponse>(profileUrl),
      ]);

    const stockDetail: StockDetail = {
      currentPrice: quoteResponse.data.c,
      changeInPrice: quoteResponse.data.d,
      percentageChange: quoteResponse.data.dp,
      highPriceOfDay: quoteResponse.data.h,
      lowPriceOfDay: quoteResponse.data.l,
      openingPrice: quoteResponse.data.o,
      previousClosePrice: quoteResponse.data.pc,
      timestamp: quoteResponse.data.t,

      marketCap: fundamentalsResponse.data.metric.marketCapitalization || 0,

      companyName: profileResponse.data.name,
      symbol: profileResponse.data.ticker,
      description:
        profileResponse.data.description || "No description available",
      industry: profileResponse.data.finnhubIndustry,
      country: profileResponse.data.country,
      logo: profileResponse.data.logo,
    };

    cache.set(cacheKey, stockDetail);
    return stockDetail;
  } catch (error) {
    console.error(`Error fetching data for symbol ${symbol}:`, error);
    return null;
  }
};

// GET handler with pagination for stock details based on market cap category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const { category } = params;

  const page = 10;
  const limit = 20;
  console.log(category, page, limit);

  if (!category) {
    return NextResponse.json(
      { message: "No category provided" },
      { status: 400 }
    );
  }

  try {
    const symbols = StockSymbols;
    const totalSymbols = symbols.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalSymbols);

    const paginatedSymbols = symbols.slice(startIndex, endIndex);

    // Fetch stock details with rate limiting
    const stockDetailsPromises = paginatedSymbols.map(
      async (symbolData, index) => {
        // Add a delay to avoid hitting the API rate limit
        if (index > 0) await delay(1000);
        const symbol = symbolData.symbol;
        const stockDetail = await fetchStockDetails(symbol);

        if (!stockDetail) return null;

        const marketCap = stockDetail.marketCap || 0; // Ensure marketCap has a value

        console.log(`Market Cap for ${symbol}: ${marketCap}`);

        // Adjust the cap ranges for mid and large caps
        if (category === "small-cap" && marketCap < 1_000_000_000) {
          return stockDetail;
        }
        if (
          category === "mid-cap" &&
          marketCap >= 1_000_000_000 &&
          marketCap < 10_000_000_000
        ) {
          return stockDetail;
        }
        if (category === "large-cap" && marketCap >= 10_000_000_000) {
          return stockDetail;
        }

        return null;
      }
    );

    const stockDetails = (await Promise.all(stockDetailsPromises)).filter(
      Boolean
    );
    console.log(stockDetails);

    const totalPages = Math.ceil(totalSymbols / limit);
    const pagination = {
      currentPage: page,
      limit,
      totalPages,
      totalItems: totalSymbols,
    };

    return NextResponse.json({ stockDetails, pagination });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { message: "Error fetching stock data" },
      { status: 500 }
    );
  }
}
