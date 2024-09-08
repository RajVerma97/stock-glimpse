// app/api/category/[category]/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Fetch all stock symbols from Finnhub API
const fetchAllStockSymbols = async () => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.FINNHUB_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stock symbols:", error);
    throw new Error("Failed to fetch stock symbols");
  }
};

// Fetch stock details like price, fundamentals, and profile from Finnhub API
const fetchStockDetails = async (symbol: string) => {
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

    const stockDetail = {
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

    return stockDetail;
  } catch (error) {
    console.error(`Error fetching data for symbol ${symbol}:`, error);
    return null;
  }
};

// GET handler with pagination for stock details based on market cap category
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const category = url.pathname.split("/").pop(); // Extract category from the URL path
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);

  console.log(category, page, limit);

  if (!category) {
    return NextResponse.json(
      { message: "No category provided" },
      { status: 400 }
    );
  }

  try {
    const symbols = await fetchAllStockSymbols();
    const totalSymbols = symbols.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalSymbols);

    const paginatedSymbols = symbols.slice(startIndex, endIndex);

    const stockDetailsPromises = paginatedSymbols.map(async (symbolData) => {
      const symbol = symbolData.symbol;
      const stockDetail = await fetchStockDetails(symbol);
      if (!stockDetail) return null;

      if (category === "small-cap" && stockDetail.marketCap < 1_000_000_000) {
        return stockDetail;
      }
      if (
        category === "mid-cap" &&
        stockDetail.marketCap >= 1_000_000_000 &&
        stockDetail.marketCap < 10_000_000_000
      ) {
        return stockDetail;
      }
      if (category === "large-cap" && stockDetail.marketCap >= 10_000_000_000) {
        return stockDetail;
      }

      return null;
    });

    const stockDetails = (await Promise.all(stockDetailsPromises)).filter(
      Boolean
    );

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
