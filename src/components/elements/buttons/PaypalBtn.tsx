'use client';

import {
  PayPalButtons,
  PayPalScriptProvider
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

import { ProductPrice } from "@/lib/interfaces";

import { useServer } from "@/store/serverStore";

const ButtonWrapper = ({ planId, successPageSlug }: { planId: string; successPageSlug: string; }) => {
  const router = useRouter();

  return (<PayPalButtons
    createSubscription={(data, actions) => {
      return actions.subscription
        .create({
          plan_id: planId,
        })
        .then((orderId) => {
          // Your code here after create the order
          return orderId;
        });
    }}
    onApprove={() => new Promise((resolve) => {
      router.push(successPageSlug);
      resolve();
    })}

    style={{
      shape: 'pill',
      color: 'gold',
      layout: 'vertical',
      tagline: false
    }}
  />);
}

const intentType = [
  'subscription',
  'capture',
] as const;

const PaypalBtn = (props: { intentType: (typeof intentType)[number]; prices: ProductPrice[]; clientId: string; successPageSlug: string; }) => {
  const userCurrency = useServer((state) => state.currency);
  const currentPrice = props.prices.find((el) => el.currency === userCurrency);

  return (
    <PayPalScriptProvider
      options={{
        clientId: props.clientId,
        components: "buttons",
        intent: props.intentType,
        currency: userCurrency,
        vault: true,
      }}
    >
      {currentPrice?.paypal_plan_id && <ButtonWrapper planId={currentPrice?.paypal_plan_id} successPageSlug={props.successPageSlug} />}
    </PayPalScriptProvider>
  );
};

export default PaypalBtn;