"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logout from "../logout";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // Wait for session to load
  }

  if (!session) {
    return <p>No session found</p>; // Handle missing session
  }

  return (
    <div>
      <h1>Home page {session?.user?.email}</h1>
      <Logout />
    </div>
  );
}
