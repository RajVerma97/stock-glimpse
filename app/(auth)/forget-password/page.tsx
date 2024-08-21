"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col gap-2 mx-auto max-w-md mt-10">
        <h1 className="text-3xl">Forget Password</h1>
        <form
          className="flex flex-col gap-4 mx-auto mt-5 max-w-md"
          onSubmit={handleSubmit}
        >
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Email"
            className="text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" variant={"outline"}>
            Send Reset Link
          </Button>
        </form>
        {isLoading && <Spinner />}
        {/* {error && <p className="text-red-500">{error}</p>} */}
        {success && <p className="text-green-500">{success}</p>}
      </div>
    </>
  );
}
