"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset link sent to your email");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Forget Password</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Enter your email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              style={{ color: "black" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
          {isLoading && <>Loading...</>}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>
    </>
  );
}
