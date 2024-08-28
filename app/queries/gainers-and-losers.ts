import axios from "axios";

export async function fetchGainersAndLosers() {
  const response = await axios.get("/api/top-gainers-and-losers");
  return response.data;
}
