import axios from "axios";

export async function addToWatchlist(symbol: string) {
  const response = await axios.post(
    `/api/watchlist/add-to-watchlist/${symbol}`
  );
  return response.data;
}

export async function removeFromWatchlist(symbol: string) {
  const response = await axios.get(`/api/remove-from-watchlist/${symbol}`);
  return response.data;
}

export async function getWatchlist() {
  const response = await axios.get(`/api/get-watchlist`);
  return response.data;
}
