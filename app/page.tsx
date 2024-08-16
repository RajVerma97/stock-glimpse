import Image from "next/image";
import googleLogo from "@/public/google.png";
import githubLogo from "@/public/github.png";
import {
  CredentialsSignInButton,
  GoogleSignInButton,
} from "@/components/authButtons";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/components/credentialsForm";
import { getCsrfToken } from "next-auth/react";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);

  if (session) return redirect("/timeline");

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mt-10 p-10 shadow-md">
        <h1 className="mt-10 mb-4 text-4xl font-bold">Sign In too</h1>
        <GoogleSignInButton />
        <span className="text-2xl font-semibold text-white text-center mt-8">
          Or
        </span>

        {/* <CredentialsForm /> */}
      </div>
    </div>
  );
}
