"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const { data: session } = useSession();

  const logout = async () => {
    // Await the signOut process
    await signOut({ redirect: false });
    // After signOut, manually handle the redirect
    router.push("/");
  };

  return <>{session ? <button onClick={logout}>Logout</button> : null}</>;
}
