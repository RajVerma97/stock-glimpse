import axios from "axios";

export default async function fetchCategoryStocks(category: string) {
  const response = await axios.get(`/api/category/${category}`);
  return response.data;
}
