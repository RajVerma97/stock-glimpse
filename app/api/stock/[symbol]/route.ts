import axios from "axios";
import { NextResponse } from "next/server";

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

    if (
      !quoteResponse.data ||
      !fundamentalsResponse.data ||
      !profileResponse.data
    ) {
      throw new Error("Invalid response data");
    }

    const stockDetail = {
      // Quote
      currentPrice: quoteResponse.data.c,
      changeInPrice: quoteResponse.data.d,
      percentageChange: quoteResponse.data.dp,
      highPriceOfDay: quoteResponse.data.h,
      lowPriceOfDay: quoteResponse.data.l,
      openingPrice: quoteResponse.data.o,
      previousClosePrice: quoteResponse.data.pc,
      timestamp: quoteResponse.data.t,

      // Fundamental metrics
      peRatio: fundamentalsResponse.data.metric.peRatio,
      bookValue: fundamentalsResponse.data.metric.bookValue,
      marketCap: fundamentalsResponse.data.metric.marketCap,

      // Company profile
      companyName: profileResponse.data.name,
      symbol: profileResponse.data.ticker,
      description:
        profileResponse.data.description || "No description available", // Handle if `description` is missing
      industry: profileResponse.data.finnhubIndustry, // from the API response
      country: profileResponse.data.country,
      logo: profileResponse.data.logo, // URL to the company's logo
    };

    return NextResponse.json(stockDetail);
  } catch (error) {
    console.error("Error fetching stock detail:", error);

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
