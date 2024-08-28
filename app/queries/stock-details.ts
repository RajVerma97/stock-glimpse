export async function fetchStockDetails(symbol: string) {
  const response = await fetch(`/api/stock-detail/${symbol}/fundamental`);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${await response.text()}`);
  }
  const data = await response.json();
  return data;
}
