"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const { data: session } = useSession();

  const logout = async () => {
    await signOut();
  };

  return (
    <>
      {session ? (
        <Button onClick={logout} variant="outline" className="mt-4">
          Logout
        </Button>
      ) : null}
    </>
  );
}
