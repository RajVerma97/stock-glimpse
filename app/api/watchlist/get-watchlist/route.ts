import { authConfig } from "@/lib/auth";
import User from "@/lib/models/Users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    return NextResponse.json({ watchlist: user.watchlist }, { status: 200 });
  } catch (error) {}

  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
