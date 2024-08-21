// Retrieve Payment Intent (optional)
// To retrieve the status of a specific payment intent - Might not need this immediately

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(params.id);
    return NextResponse.json(paymentIntent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
