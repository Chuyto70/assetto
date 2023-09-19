'use client';

import { ProductPrice } from "@/lib/interfaces";

import { useServer } from "@/store/serverStore";

const PriceDetails = (props: {
  className?: string;
  lineClassName?: string;
  amountClassName?: string;
  prices: ProductPrice[];
}) => {
  const translations = useServer.getState().translations;
  const userCurrency = useServer((state) => state.currency);
  const currentPrice = props.prices.find((el) => el.currency === userCurrency);
  return (
    <>
      {currentPrice?.details.map((detail, index) => (
        <div key={index} className={props.className}>
          <p className={props.lineClassName}>{detail.line_name}</p>
          <p className={props.amountClassName}>{detail.amount}{currentPrice.currency_symbol}</p>
        </div>
      ))}
      {currentPrice && currentPrice.details.length <= 0 && <p>{translations.errors.price_no_details}</p>}
    </>
  )
}

export default PriceDetails;