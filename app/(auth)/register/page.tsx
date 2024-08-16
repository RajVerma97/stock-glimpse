"use client"; // Ensures it's a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use this for App Router

export default function SignUpForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        console.log("Redirecting to /home...");
        router.push("/home"); // Redirect to the home page after successful signup
      } else {
        setError(responseData.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Fetch Error:", error); // Log fetch errors
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className=" border-2 mt-1 block w-full border-gray-500   rounded-md shadow-sm focus:border-black focus:ring-black text-black"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className=" border-2 mt-1 block w-full border-gray-500   rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className=" border-2 mt-1 block w-full border-gray-500  rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            required
          />
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
