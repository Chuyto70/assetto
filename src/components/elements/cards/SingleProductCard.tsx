import Link from 'next/link';

import style from './SingleProductCard.module.css';

import { isOnSale } from '@/lib/helper';
import { Product } from '@/lib/interfaces';

import ProductCarousel from '@/components/elements/carousel/ProductCarousel';

import { useServer } from '@/store/serverStore';

const SingleProductCard = ({
  product,
  imgSizes,
  colorSwitch,
}: {
  product: Product;
  imgSizes?: string;
  colorSwitch?: (id: number) => void;
}) => {
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
  } = product.attributes;

  const { locale, translations } = useServer.getState();

  return (
    <div className={style.product}>
      <Link href={`/${locale}/${slug}`} className={style.product}>
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
            <button
              key={color.product.data.id}
              style={{ backgroundColor: color.color }}
              onClick={() => colorSwitch && colorSwitch(color.product.data.id)}
            ></button>
          ))}
          {colors.length} {translations.colors}
        </p>
      )}
    </div>
  );
};

export default SingleProductCard;

/**
 * TODO: Ajouter le bandeau promo ou nouveauté sur le composant
 */
