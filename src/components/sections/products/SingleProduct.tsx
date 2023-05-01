import { isBefore, parseISO } from 'date-fns';
import isAfter from 'date-fns/isAfter';
import Link from 'next/link';

import { QueryProduct } from '@/lib/graphql';

const isOnSale = (
  date_on_sale_from: string | Date | undefined,
  date_on_sale_to: string | Date | undefined
) => {
  if (date_on_sale_from && date_on_sale_to) {
    const currentDate = new Date();
    const fromDate =
      typeof date_on_sale_from === 'string'
        ? parseISO(date_on_sale_from)
        : date_on_sale_from;
    const toDate =
      typeof date_on_sale_to === 'string'
        ? parseISO(date_on_sale_to)
        : date_on_sale_to;

    if (isAfter(currentDate, fromDate) && isBefore(currentDate, toDate))
      return true;
  }
  return false;
};

export default (async function SingleProduct({
  locale,
  productID,
}: {
  locale: string;
  productID: number;
}) {
  const { title, slug, price, sale_price, date_on_sale_from, date_on_sale_to } =
    await QueryProduct(locale, productID);

  return (
    <Link href={`/${slug}`}>
      <div>
        <h4>{title}</h4>
        <p>
          {sale_price && isOnSale(date_on_sale_from, date_on_sale_to) && (
            <span>{sale_price}</span>
          )}
          {price}€
        </p>
      </div>
    </Link>
  );
} as unknown as ({
  locale,
  productID,
}: {
  locale: string;
  productID: number;
}) => JSX.Element);
