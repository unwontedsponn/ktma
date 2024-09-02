// api/stripe/webhook/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/app/utils/stripeConfig.server';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, stripeWebhookSecret as string);

    if (event.type === 'payment_intent.succeeded') {
      const { userId, email } = (event.data.object as any).metadata || {};

      if (userId) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/make-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, email }),
        });

        if (!response.ok) {
          console.error(`Order processing failed: ${response.statusText}`);
          return NextResponse.json({ error: 'Failed to process the order' }, { status: 500 });
        }

        console.log(`Order processed for user: ${userId}`);
      } else console.error('No userId in payment intent metadata');
    }

    return NextResponse.json({ received: true });
  } 
  
  catch (error) {
    console.error('Error handling Stripe webhook:', (error as Error).message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
