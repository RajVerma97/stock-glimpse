// app/api/watchlist/remove-from-watchlist/route.ts
import User from "@/lib/models/Users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;

  if (!symbol) {
    return NextResponse.json(
      { message: "Symbol parameter is missing" },
      { status: 400 }
    );
  }

  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  const sessionUser = session.user;

  try {
    const user = await User.findOne({ email: sessionUser.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const index = user.watchlist.findIndex((item) => item.symbol == symbol);

    if (index == -1) {
      return NextResponse.json(
        { message: "Symbol not found in watchlist" },
        { status: 404 }
      );
    }

    user.watchlist.splice(index, 1);
    await user.save();

    return NextResponse.json(
      { message: "Removed from watchlist" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || "Internal Server Error";

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
