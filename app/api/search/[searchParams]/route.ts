import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { searchParams: string } }
) {
  const { searchParams } = params;
  try {
    const url = `https://api.polygon.io/v3/reference/tickers?search=${searchParams}&apiKey=${process.env.POLYGON_API_KEY}`;
    const response = await axios.get(url);
    return NextResponse.json(response.data);
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
