import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import logger from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  logger(body);
  // CHECK STOCK + EDIT STOCK
  try {
    const { status } = await stripe.paymentIntents.confirm(
      body.payment_intent_id,
      {
        payment_method: body.payment_method,
        return_url: 'http://localhost:3000/order/123/complete',
        use_stripe_sdk: true,
        mandate_data: {
          customer_acceptance: {
            type: 'online',
            online: {
              ip_address: req.ip,
              user_agent:
                req.headers.get('user-agent') ??
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
            },
          },
        },
      }
    );
    return NextResponse.json({ status }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Could not confirm this intent' } },
      { status: 500 }
    );
  }
};

export const runtime = 'edge';
