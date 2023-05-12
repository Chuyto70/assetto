export interface CartItem {
  product: Product;
  size: string;
  qty: number;
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

interface Media {
  attributes: {
    alternativeText?: string;
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
