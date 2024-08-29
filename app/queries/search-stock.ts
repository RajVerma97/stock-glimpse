import axios from "axios";

export const searchStocks = async (searchParams: string): Promise<any> => {
  const response = await axios.get(`/api/search/${searchParams}`);
  return response.data;
};
