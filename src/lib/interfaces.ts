export interface CartItem {
  product: Product;
  size: string;
  price: number;
  qty: number;
  color?: string;
}

export interface Product {
  id: number;
  selectedSize?: string;
  attributes: {
    title: string;
    slug: string;
    price: number;
    sale_price?: number;
    date_on_sale_from?: string;
    date_on_sale_to?: string;
    medias: {
      data: Media[];
    };
    short_description?: string;
    description: string;
    sizes: {
      id: number;
      size: string;
      quantity: number;
    }[];
    colors?: {
      name: string;
      color: string;
      product: {
        data: {
          id: number;
        };
      };
    }[];
    categories?: {
      data: Category[];
    };
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations: {
      data: Localizations[];
    };
  };
}

export interface Category {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    short_description: string;
    products: {
      data: Product[];
    };
    content: {
      __typename: string;
    };
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations: {
      data: Localizations[];
    };
  };
}

export interface Page {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: {
      __typename: string;
    };
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations: {
      data: Localizations[];
    };
  };
}

export interface Setting {
  attributes: {
    favicons: {
      data: {
        attributes: {
          url: string;
        };
      }[];
    };
    seo: DefaultSeoMetadata;
    payment_provider: string;
  };
}

export interface Order {
  id: number;
  attributes: {
    payment_intent_id: string;
    email: string;
    billing_name: string;
    billing_city: string;
    billing_country: string;
    billing_line1: string;
    billing_line2: string;
    billing_postal_code: string;
    billing_state: string;
    shipping_name: string;
    shipping_city: string;
    shipping_country: string;
    shipping_line1: string;
    shipping_line2: string;
    shipping_postal_code: string;
    shipping_state: string;
    status: ENUM_ORDER_STATUS;
    amount: number;
    products: OrderProducts[];
  };
}

export interface OrderProducts {
  id: number;
  title: string;
  price: number;
  qty: number;
  size: string;
  color?: string;
}

interface Media {
  attributes: {
    alternativeText?: string;
    name?: string;
    url: string;
    width: number;
    height: number;
    mime: string;
  };
}

interface DefaultSeoMetadata {
  title: string;
  siteName: string;
  description: string;
}

interface SeoMetadata {
  template_title?: string;
  title_suffix?: string;
  meta_description?: string;
}

interface Localizations {
  attributes: {
    locale: string;
    slug: string;
  };
}

export enum ENUM_ORDER_STATUS {
  succeeded = 'succeeded',
  pending = 'pending',
  checkout = 'checkout',
  failed = 'failed',
  canceled = 'canceled',
}

export enum PAYMENT_PROVIDER {
  STRIPE = 'STRIPE',
}
