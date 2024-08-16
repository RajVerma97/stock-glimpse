import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validation checks
    if (!email || !password || !name) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing email, password, or name' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: 'User already exists' }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return new NextResponse(
      JSON.stringify(user),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
