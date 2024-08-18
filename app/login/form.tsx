"use client";

import { GoogleSignInButton } from "@/components/authButtons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Reset error state
    setError(null);

    const response = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (response?.error) {
      // Set error message from response
      setError(response.error);
    } else if (response?.ok) {
      // Redirect to home if login is successful
      router.push("/home");
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
        required
      />
      <input
        name="password"
        className="border border-black text-black"
        type="password"
        required
      />
      <button type="submit">Login</button>

      <GoogleSignInButton />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
