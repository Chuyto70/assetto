import { isBefore, parseISO } from 'date-fns';
import isAfter from 'date-fns/isAfter';
import Link from 'next/link';

import style from './SingleProductCard.module.css';

import { QueryProduct } from '@/lib/graphql';

import ProductCarousel from '@/components/elements/carousel/ProductCarousel';

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

export default (async function SingleProductCard({
  locale,
  productID,
  imgSizes,
  options,
}: {
  locale: string;
  productID: number;
  imgSizes?: string;
  options?: { colors: boolean; short_description: boolean };
}) {
  const {
    title,
    slug,
    price,
    sale_price,
    date_on_sale_from,
    date_on_sale_to,
    medias,
    short_description,
    colors,
  } = await QueryProduct(locale, productID, options);

  return (
    <div className={style.product}>
      <Link href={`/${slug}`} className={style.product}>
        <ProductCarousel
          medias={medias}
          className={style.product__carousel}
          imgSizes={imgSizes}
        />
        <div className={style.product__title}>
          <h4>{title}</h4>
          {(sale_price && isOnSale(date_on_sale_from, date_on_sale_to) && (
            <p>
              <span>{sale_price} | </span>
              <s>{price}</s> €
            </p>
          )) || <p>{price} €</p>}
        </div>
        {short_description && (
          <p className={style.product__short_description}>
            {short_description}
          </p>
        )}
      </Link>
      {colors && colors.length > 0 && (
        <p className={style.product__colors}>
          {colors.map((color) => (
            <span
              key={color.product.data.id}
              style={{ backgroundColor: color.color }}
            ></span>
          ))}
          {colors.length} coloris
          {/* Texte à traduire plus lien pour switch ce composant a l'autre version */}
        </p>
      )}
    </div>
  );
} as unknown as ({
  locale,
  productID,
  imgSizes,
  options,
}: {
  locale: string;
  productID: number;
  imgSizes?: string;
  options?: { colors: boolean; short_description: boolean };
}) => JSX.Element);
