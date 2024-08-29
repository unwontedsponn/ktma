#!/bin/bash

# Set the environment variables or replace with actual values
STRIPE_SECRET_KEY=sk_test_51IREfQA2IluYz9Rqp1fBFCo05rjvKyXpCt9NIP8HTlc2D9ZLySdZzFuRtO29W3kMo8rEX6WFcU8zLpCmdcD8JVuB00JmdbV2H1
WEBHOOK_ID="whsec_KBWQ0cc2VPoiJxLVnYt9wL9tiSLK2qqc"
NEW_URL=https://placeholder-url.com/api/stripe/webhook/post

# Use Stripe API to update the webhook endpoint URL
curl -X POST https://api.stripe.com/v1/webhook_endpoints/$WEBHOOK_ID \
  -u $STRIPE_SECRET_KEY: \
  -d "url=$NEW_URL"
