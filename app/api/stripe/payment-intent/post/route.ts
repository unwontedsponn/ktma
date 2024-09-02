// api/stripe/payment-intent/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/utils/stripeConfig.server';

export async function POST(req: NextRequest) {

  try {
    const { amount, userId, email } = await req.json(); // Ensure you receive the userId here

    if (!userId) throw new Error('User ID is required');

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 1000 for $10.00)
      currency: 'usd', // Set the currency
      payment_method_types: ['card'], // Specify that payment is via card
      metadata: { userId, email }, // Include userId in metadata
    });
    console.log('Payment intent created with metadata:', paymentIntent.metadata);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } 
  catch (error) {
    const message = (error as Error).message || 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}