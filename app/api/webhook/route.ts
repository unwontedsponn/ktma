// This is only called from Stripe - not from within my project like the other API calls
import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/app/utils/stripeConfig.server';
import { sendEmail } from '@/app/utils/sendEmail';
import path from 'path';
import fs from 'fs/promises';

// Define a type for the metadata structure
interface Metadata {
  userId?: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, stripeWebhookSecret as string);

    if (event.type === 'payment_intent.succeeded') {
      const { userId, email } = (event.data.object as { metadata: Metadata }).metadata || {};

      if (userId && email) {
        // Process order
        const response = await fetch(`/api/make-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, email }),
        });

        if (!response.ok) return NextResponse.json({ error: 'Failed to process the order' }, { status: 500 });

        try {
          // Fetch the PDF book from the assets
          const bookPath = path.resolve(process.cwd(), 'assets', 'Beginner to Composer.pdf');
          const bookPDF = await fs.readFile(bookPath);          
          await sendEmail(email, bookPDF);          
        } 
        catch (emailError) {return NextResponse.json({ error: 'Failed to send PDF email' }, { status: 500 });}
      } 
      else return NextResponse.json({ error: 'Missing userId or email in payment intent metadata' }, { status: 400 });
    }
    return NextResponse.json({ received: true });
  } 
  catch (error) {return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });}
}
