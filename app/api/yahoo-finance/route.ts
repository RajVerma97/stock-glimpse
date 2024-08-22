import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { stock } = await request.json();

  const options = {
    method: "POST",
    url: "https://yahoo-finance160.p.rapidapi.com/info",
    headers: {
      "x-rapidapi-key": process.env.YAHOO_FINANCE_API_KEY as string,
      "x-rapidapi-host": "yahoo-finance160.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: { stock },
  };

  try {
    const response = await axios(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.error();
  }
}
