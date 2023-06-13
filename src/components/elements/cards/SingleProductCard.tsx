import Link from 'next/link';

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
    <div className='flex flex-col gap-4'>
      <Link href={`/${locale}/${slug}`} className='flex flex-col gap-4'>
        <ProductCarousel
          medias={medias}
          className='aspect-[2/3] rounded-md'
          imgSizes={imgSizes}
        />
        <div className='flex items-center justify-between gap-2 whitespace-nowrap font-bold'>
          <h4 className='truncate'>{title}</h4>
          {(sale_price && isOnSale(date_on_sale_from, date_on_sale_to) && (
            <p className='text-dark_pink max-w-full text-lg'>
              <span>{sale_price} | </span>
              <s>{price}</s> €
            </p>
          )) || <p className='text-dark_pink max-w-full text-lg'>{price} €</p>}
        </div>
        {short_description && (
          <p className='text-gray-500'>{short_description}</p>
        )}
      </Link>
      {colors && colors.length > 0 && (
        <p className='flex items-center gap-4 font-bold text-gray-500'>
          {colors.map((color) => (
            <button
              key={color.product.data.id}
              style={{ backgroundColor: color.color }}
              className='border-dark h-4 w-4 rounded-full border'
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
