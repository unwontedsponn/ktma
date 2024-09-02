// api/cart/update-email/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) throw new Error('User ID and email are required');

    // Update the email in the cart for the given user
    await sql`
      UPDATE cart
      SET email = ${email}
      WHERE userid = ${userId};
    `;

    return NextResponse.json({ message: 'Email updated successfully' });
  } 
  catch (error) {
    const message = (error as Error).message || 'Error updating email in cart:';    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}