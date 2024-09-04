import { authConfig } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/lib/models/Users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const stock = await request.json();
  const { symbol } = stock;
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Login required" }, { status: 401 });
  }

  try {
    await connectDB();

    const userEmail = session.user.email;
    const userFromDb = await User.findOne({ email: userEmail });

    if (!userFromDb) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    if (userFromDb.watchlist.some((item) => item.symbol === symbol)) {
      return NextResponse.json(
        { message: "Symbol already in watchlist" },
        { status: 400 }
      );
    }

    userFromDb.watchlist.push(stock);

    await userFromDb.save();

    return NextResponse.json({
      message: "Item added to watchlist successfully",
      status: 200,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "Internal Server Error";

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
