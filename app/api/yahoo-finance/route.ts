import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { stock } = await request.json(); // Get stock symbol from request body

    const response = await axios.post(
      "https://yahoo-finance160.p.rapidapi.com/info",
      { stock }, // Use body for POST request
      {
        headers: {
          "x-rapidapi-key": process.env.YAHOO_FINANCE_API_KEY as string,
          "x-rapidapi-host": "yahoo-finance160.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      return NextResponse.json(
        { error: error.response?.data || "Failed to fetch stock data" },
        { status: error.response?.status || 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Failed to fetch stock data" },
        { status: 500 }
      );
    }
  }
}
