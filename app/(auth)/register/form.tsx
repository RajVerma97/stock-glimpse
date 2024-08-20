"use client";

import { signIn } from "next-auth/react"; // Import signIn
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    console.log(response);
    const result = await response.json();

    if (!response.ok) {
      setError(response.message);
      return;
    } else {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (result?.ok) {
        router.push("/home");
      } else {
        console.log("Error signing in after registration:", result?.error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 mx-auto max-w-md mt-10"
    >
      <input
        name="email"
        className="border border-black text-black"
        type="email"
      />
      <input
        name="password"
        className="border border-black  text-black"
        type="password"
      />
      <button type="submit">Register</button>

      {error && <p className="text-red-500 mt-2">jfd k skjfh</p>}
    </form>
  );
}
