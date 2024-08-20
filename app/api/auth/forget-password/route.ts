import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "@/lib/models/Users";
import { sendResetPasswordEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/utils";

const RESET_TOKEN_EXPIRATION_MS = 3600000;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return NextResponse.json(
        { message: "User not found with email " + email },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRATION_MS; // 1 hour

    await user.save();

    const resetURL = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    await sendResetPasswordEmail(resetURL, email);

    return NextResponse.json(
      { message: "Password reset link sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /reset-password:", error);
    const errorMessage =
      (error as Error).message || "An unknown error occurred";
      
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
