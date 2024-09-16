import axios from "axios";

export default async function fetchStockNews(symbol: string) {
  const response = await axios.get(`/api/news/get-stock-news/${symbol}`);
  return response.data;
}
