import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import {
  MutationUpdateManyProductSize,
  MutationUpdateOrder,
  MutationUpdateProductSize,
  QueryOrderFromPaymentIntent,
} from '@/lib/graphql';
import { ENUM_ORDER_STATUS } from '@/lib/interfaces';

import checkCart from '@/actions/checkCart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  if (!body.payment_intent_id)
    return NextResponse.json(
      { error: { message: 'Please provide the payment intent id' } },
      { status: 400 }
    );
  if (!body.payment_method)
    return NextResponse.json(
      { error: { message: 'Please provide the payment method' } },
      { status: 400 }
    );
  if (!body.return_url)
    return NextResponse.json(
      { error: { message: 'Please provide the return url' } },
      { status: 400 }
    );
  try {
    // Check cart from order in backend
    const { data } = await QueryOrderFromPaymentIntent(body.payment_intent_id);
    const { status, products } = data[0].attributes;
    if (status !== ENUM_ORDER_STATUS.checkout)
      return NextResponse.json(
        { error: { message: 'This order cannot be confirmed.' } },
        { status: 400 }
      );
    const { error } = await checkCart(products);
    if (error)
      return NextResponse.json(
        {
          error: {
            message:
              'This cart is no longer valid, please revalidate your cart.',
          },
        },
        { status: 400 }
      );

    // Update stocks
    for (let i = 0; i++; i < products.length) {
      const input = {
        quantity: -products[i].qty,
      };
      await MutationUpdateProductSize(products[i].sizeId, input);
    }
    try {
      if (products.length > 1) {
        await MutationUpdateManyProductSize(
          products.map((product) => product.sizeId),
          products.map((product) => {
            return { quantity: -product.qty };
          })
        );
      } else {
        await MutationUpdateProductSize(products[0].sizeId, {
          quantity: -products[0].qty,
        });
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: {
            message:
              'This cart is no longer valid, please revalidate your cart.',
          },
        },
        { status: 400 }
      );
    }

    // Confirm payment in stripe
    const {
      status: stripeStatus,
      next_action,
      client_secret,
      metadata,
    } = await stripe.paymentIntents.confirm(body.payment_intent_id, {
      payment_method: body.payment_method,
      return_url: body.return_url,
      use_stripe_sdk: true,
      mandate_data: {
        customer_acceptance: {
          type: 'online',
          online: {
            ip_address: req.ip ?? req.headers.get('x-forwarded-for') ?? '',
            user_agent:
              req.headers.get('user-agent') ??
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
          },
        },
      },
    });

    // Change order status
    MutationUpdateOrder(metadata.order_id, {
      status: ENUM_ORDER_STATUS.pending,
    });

    return NextResponse.json(
      { status: stripeStatus, next_action, client_secret },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
};

export const runtime = 'edge';
