import React, { useEffect, useState } from "react";

const RealTimeStockPage = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://data.alpaca.markets/stream");

    socket.onopen = () => {
      console.log("Connected to Alpaca WebSocket");

      // Authenticate
      socket.send(
        JSON.stringify({
          action: "auth",
          key: process.env.ALPACA_API_KEY,
          secret: process.env.ALPACA_SECRET_KEY,
        })
      );

      // Subscribe to real-time stock pricing for SPY
      socket.send(
        JSON.stringify({
          action: "subscribe",
          trades: ["SPY"], // SPY is an ETF that tracks the S&P 500
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.T === "t") {
        setPrice(data.p); // Update state with the latest price
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError(
        "WebSocket error occurred. Please check the console for details."
      );
    };

    socket.onclose = () => {
      console.log("Disconnected from Alpaca WebSocket. Reconnecting...");
      setTimeout(() => {
        // Reconnect logic if needed
      }, 3000); // Reconnect after 3 seconds
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Real-Time Stock Price</h1>
      {error ? (
        <div className="text-red-500 mt-4">{error}</div>
      ) : (
        <div className="text-xl mt-4">
          {price ? (
            <span>Current SPY Price: ${price.toFixed(2)}</span>
          ) : (
            <span>Loading real-time data...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeStockPage;
