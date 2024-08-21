"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Form() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      // @ts-expect-error
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
      <Input
        name="email"
        className="border border-black text-black"
        type="email"
        placeholder="Email"
        required
      />
      <Input
        name="password"
        className="border border-black  text-black"
        type="password"
        placeholder="Password"
        required
      />
      <Button variant={"outline"} type="submit">
        Register
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
