import axios from "axios";

export async function fetchMarketIndex(symbol: string) {
  try {
    const response = await axios.get(`/api/get-market-index/${symbol}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching market index:", error);
    throw error; // Rethrow to be handled by React Query
  }
}
