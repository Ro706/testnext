import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/model/User";
import { signinSchema } from "@/schemas/auth";
import { signToken } from "@/lib/jwt"; // ⭐ NEW

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔐 ⭐ CREATE JWT TOKEN
    const token = signToken({
      userId: user._id,
      email: user.email,
    });

    // ✅ Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // 🍪 ⭐ STORE JWT IN COOKIE (NOT userId)
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
