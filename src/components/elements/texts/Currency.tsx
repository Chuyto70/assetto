'use client';

import { useServer } from "@/store/serverStore";

const Currency = (props: { prices: { price: number; currency: string; currency_symbol: string }[] }) => {
  const userCurrency = useServer((state) => state.currency);
  const currentPrice = props.prices.find((el) => el.currency === userCurrency);
  return (
    <span className="currency_symbol">
      {currentPrice?.currency_symbol}
    </span>
  )
}

export default Currency;