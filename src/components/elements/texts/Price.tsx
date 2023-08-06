'use client';

import { ProductPrice } from "@/lib/interfaces";

import { useServer } from "@/store/serverStore";

const Price = (props: { prices: ProductPrice[] }) => {
  const userCurrency = useServer((state) => state.currency);
  const currentPrice = props.prices.find((el) => el.currency === userCurrency);
  return (
    <>
      {currentPrice?.price}
    </>
  )
}

export default Price;