import User from "@/lib/models/Users";
import { connectDB } from "@/lib/utils";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request, res: Response) {
  const { email, password, token } = await req.json();

  try {
    await connectDB();
    console.log(token, password, "token and password from route");
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      NextResponse.json(
        { message: "No user found with that token" },
        { status: 404 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (
      user.resetPasswordToken !== hashedToken ||
      user.resetPasswordExpires < Date.now()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
    return NextResponse.json(
      { message: "Password Reset Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error },
      { status: 500 }
    );
  }
}
