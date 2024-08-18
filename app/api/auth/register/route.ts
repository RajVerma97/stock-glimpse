import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import User from '@/lib/models/Users';
import { connectDB } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the request body
    const { email, password } = await request.json();
    // Validate email and password
    console.log({ email, password });

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    return NextResponse.json({ message: 'success' });
  } catch (e) {
    console.error('Error:', e);
    
    // Handle unknown error type
    if (e instanceof Error) {
      return NextResponse.json({ message: 'error', error: e.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'error', error: 'An unknown error occurred' }, { status: 500 });
  }
}
