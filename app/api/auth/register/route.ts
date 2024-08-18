import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import User from '@/lib/models/Users';
import { connectDB } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const hashedPassword = await hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({ message: 'success' });
  } catch (e) {
    console.error('Error:', e);
    
    if (e instanceof Error) {
      return NextResponse.json({ message: 'error', error: e.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'error', error: 'An unknown error occurred' }, { status: 500 });
  }
}
