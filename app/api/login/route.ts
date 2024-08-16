import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // Make sure to install bcrypt for password hashing

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation checks
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing email or password' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("user:", user);



    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log(typeof(password),typeof(user.password));

    // Check if the password is correct (assuming plain text; use hashed comparison in production)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("isPasswordValid:", isPasswordValid);

    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Successful login
    return new NextResponse(
      JSON.stringify({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
