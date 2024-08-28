import axios from "axios";

export const searchStocks = async (searchParams: string): Promise<any> => {
  const response = await axios.get("/api/stock/search", {
    params: { searchParams },
  });
  return response.data;
};
