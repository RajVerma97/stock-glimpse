"use client";

import Email from "next-auth/providers/email";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenFromQuery = query.get("token");
    const emailFromQuery = query.get("email");

    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    }

    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Password fields must be filled");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, password, token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {" "}
      <div>
        <h1>Reset Your Password</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black  text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-black  text-black"
              required
            />
          </div>
          <button type="submit">Reset Password</button>
          {isLoading && <>Loading...</>}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </div>
    </>
  );
}
