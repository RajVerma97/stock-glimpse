import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  // Endpoints for various data sources
  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const fundamentalsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
  const historicalUrl = `https://yahoo-finance160.p.rapidapi.com/stock/v2/get-historical-data?symbol=${symbol}&region=US`;

  try {
    const [
      quoteResponse,
      fundamentalsResponse,
      profileResponse,
      historicalResponse,
    ] = await Promise.all([
      axios.get(quoteUrl),
      axios.get(fundamentalsUrl),
      axios.get(profileUrl),
      axios.get(historicalUrl, {
        headers: {
          "x-rapidapi-key": process.env.YAHOO_FINANCE_API_KEY as string,
          "x-rapidapi-host": "yahoo-finance160.p.rapidapi.com",
        },
      }),
    ]);

    console.log("Quote Response:", quoteResponse.data);
    console.log("Fundamentals Response:", fundamentalsResponse.data);
    console.log("Profile Response:", profileResponse.data);
    console.log("Historical Response:", historicalResponse.data);

    if (
      !quoteResponse.data ||
      !fundamentalsResponse.data ||
      !profileResponse.data ||
      !historicalResponse.data ||
      !historicalResponse.data.prices
    ) {
      throw new Error("Invalid response data");
    }

    const historicalData = historicalResponse.data.prices
      .map((dayData: any) => ({
        date: new Date(dayData.date * 1000).toISOString().split("T")[0],
        open: dayData.open,
        high: dayData.high,
        low: dayData.low,
        close: dayData.close,
        volume: dayData.volume,
      }))
      .reverse(); // Optional: reverse the data to have the oldest dates first

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
      historicalData, // Add historical data here
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
