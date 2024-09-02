import { authConfig } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/lib/models/Users";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  console.log(symbol);
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Login required " }, { status: 401 });
  }

  try {
    await connectDB();

    const user = session.user;
    const userId = user.id; // Adjust based on how the user ID is stored in the session

    const userFromDb = await User.findById(userId);

    if (!userFromDb) {
      return NextResponse.json(
        { message: "User not found in DB" },
        { status: 404 }
      );
    }

    // Handle the addition of an item to the watchlist
    // Example: const updatedWatchlist = await userFromDb.addToWatchlist(id);
    // Replace this with your actual logic for updating the watchlist

    return NextResponse.json({
      message: "Item added to watchlist successfully",
    });
  } catch (error) {
    console.error("Error updating watchlist:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
