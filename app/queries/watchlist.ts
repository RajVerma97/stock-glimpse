import axios from "axios";
import { Stock } from "../types/stock-detail";

export async function addToWatchlist(stock: Stock) {
  const response = await axios.post(`/api/watchlist/add-to-watchlist`, stock);
  return response.data;
}

export async function removeFromWatchlist(symbol: string) {
  const response = await axios.delete(
    `/api/watchlist/remove-from-watchlist/${symbol}`
  );
  return response.data;
}

export async function getWatchlist() {
  const response = await axios.get(`/api/watchlist/get-watchlist`);
  return response.data;
}
