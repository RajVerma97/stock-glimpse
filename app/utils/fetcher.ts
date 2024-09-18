// utils/fetcher.js
export const fetcher = (...args) => fetch(...args).then((res) => res.json())
