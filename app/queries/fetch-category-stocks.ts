// queries/fetch-category-stocks.ts
import axios from "axios";

const fetchCategoryStocks = async (
  category: string,
  page: number,
  limit: number
) => {
  const response = await axios.get(`/api/category/${category}`, {
    params: { page, limit },
  });
  return response.data;
};

export default fetchCategoryStocks;
