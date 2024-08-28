export async function fetchHistoricalData(symbol: string) {
  const response = await fetch(`/api/stock-detail/${symbol}/historical/`);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${await response.text()}`);
  }
  const data = await response.json();
  return data;
}
