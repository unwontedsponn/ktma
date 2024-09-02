// api/cart/checkout/route.ts
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/utils/stripeConfig.server';

export async function POST(req: NextRequest) {
  try {
    const { amount, userId, email } = await req.json();

    if (!userId || !email) throw new Error('User ID and email are required');

    // Step 1: Update the email in the cart
    await sql`
      UPDATE cart
      SET email = ${email}
      WHERE userid = ${userId};
    `;

    // Step 2: Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { userId, email },
    });

    // Step 3: Respond with the client secret for the payment intent
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}