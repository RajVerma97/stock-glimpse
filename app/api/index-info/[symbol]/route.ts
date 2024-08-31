import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const SPX_TICKER = "SPX";
  const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
  const response = await axios.get(
    `https://api.polygon.io/v2/aggs/ticker/${SPX_TICKER}/range/1/day/2023-01-01/2023-08-01?adjusted=true&sort=asc&limit=120&apiKey=${POLYGON_API_KEY}`
  );
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
