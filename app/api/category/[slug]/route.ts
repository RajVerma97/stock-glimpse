import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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

    console.log(`Data for ${symbol}:`, {
      quoteResponse: quoteResponse.data,
      fundamentalsResponse: fundamentalsResponse.data,
      profileResponse: profileResponse.data,
    });

    const stockDetail = {
      currentPrice: quoteResponse.data.c,
      changeInPrice: quoteResponse.data.d,
      percentageChange: quoteResponse.data.dp,
      highPriceOfDay: quoteResponse.data.h,
      lowPriceOfDay: quoteResponse.data.l,
      openingPrice: quoteResponse.data.o,
      previousClosePrice: quoteResponse.data.pc,
      timestamp: quoteResponse.data.t,

      marketCap: fundamentalsResponse.data.metric.marketCapitalization,

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
    return null; // Return null if there is an error fetching details for a symbol
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  console.log(`Received slug: ${slug}`);

  if (!slug) {
    return NextResponse.json(
      { message: "No symbol provided" },
      { status: 400 }
    );
  }

  try {
    // Fetch all symbols
    const symbols = await fetchAllStockSymbols();
    console.log("Fetched symbols:", symbols);

    // Fetch details for each symbol and filter by slug category
    const stockDetailsPromises = symbols.map(async (symbolData) => {
      const symbol = symbolData.symbol; // Adjust this if needed
      console.log(`Fetching details for symbol: ${symbol}`);
      
      const stockDetail = await fetchStockDetails(symbol);
      if (!stockDetail) return null;

      if (slug === "small-cap" && stockDetail.marketCap < 1000000000) {
        return stockDetail;
      }
      if (
        slug === "mid-cap" &&
        stockDetail.marketCap > 1000000000 &&
        stockDetail.marketCap < 10000000000
      ) {
        return stockDetail;
      }
      if (slug === "large-cap" && stockDetail.marketCap > 10000000000) {
        return stockDetail;
      }

      return null;
    });

    // Resolve all promises and filter out null values
    const stockDetails = (await Promise.all(stockDetailsPromises)).filter(
      Boolean
    );

    console.log("Stock details:", stockDetails);

    return NextResponse.json(stockDetails);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { message: "Error fetching stock data" },
      { status: 500 }
    );
  }
}