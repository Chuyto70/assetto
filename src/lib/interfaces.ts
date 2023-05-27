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
      data: [
        {
          attributes: {
            locale: string;
            slug: string;
          };
        }
      ];
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
      data: [
        {
          attributes: {
            locale: string;
            slug: string;
          };
        }
      ];
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
      data: [
        {
          attributes: {
            locale: string;
            slug: string;
          };
        }
      ];
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
  };
}

export interface Order {
  id: number;
  attributes: {
    stripe_tx_id: string;
    name: string;
    email: string;
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
    status: ENUM_ORDER_STATUS;
    amount: number;
    products: unknown;
  };
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

enum ENUM_ORDER_STATUS {
  succeeded,
  pending,
  checkout,
  failed,
}
