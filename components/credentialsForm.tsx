"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CredentialsFormProps {
  csrfToken?: string;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Extract email and password from form data
    const email = data.get("email");
    const password = data.get("password");

    // Send POST request to /api/login
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Log the response status and content type
      console.log("Response Status:", res.status);
      console.log("Content-Type:", res.headers.get("Content-Type"));

      let responseData;
      const contentType = res.headers.get("Content-Type");

      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
        console.log("Response Data:", responseData);
      } else {
        // Handle non-JSON responses
        const text = await res.text();
        console.log("Response Text:", text);
        setError("An unexpected error occurred: " + text);
        return;
      }

      if (res.ok) {
        console.log("Redirecting to /home");
        // Redirect to the homepage (/home) after successful login
        router.push("/home");
      } else {
        // Handle login errors
        setError(responseData.message || "Your Email or Password is wrong!");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <form
      className="w-full mt-8 text-xl text-black font-semibold flex flex-col"
      onSubmit={handleSubmit}
    >
      {error && (
        <span className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md">
          {error}
        </span>
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="w-full h-12 px-6 mt-4 text-lg text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-blue-700"
      >
        Log in
      </button>
    </form>
  );
}
