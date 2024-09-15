import axios from "axios";

export default async function fetchMarketNews() {
  const response = await axios.get("/api/news/get-market-news");
  return response.data;
}
