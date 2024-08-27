import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchStocks = async (searchParams: string): Promise<any> => {
  const response = await axios.get("/api/stocks/search", {
    params: { searchParams }, // Correctly set query as a simple parameter
  });
  return response.data;
};

const useSearchStocks = (searchParams: string) => {
  return useQuery({
    queryKey: ["search", searchParams],
    queryFn: () => fetchStocks(searchParams),
    enabled: !!searchParams,
  });
};
export default useSearchStocks;
