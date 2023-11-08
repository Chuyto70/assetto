export interface CartItem {
  product: Product;
  size: string;
  price: number;
  qty: number;
  color?: string;
}

export interface Product {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    medias: {
      data: UploadFile[];
    };
    categories?: {
      data: Category[];
    };
    prices: ProductPrice[];
    success_page?: {
      data: Page;
    };
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations?: {
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
    price_text: string;
    btn_text: string;
    products: {
      data: Product[];
    };
    content: {
      __typename: string;
    };
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations?: {
      data: Localizations[];
    };
  };
}

export interface Page {
  id: number;
  attributes: {
    title?: string;
    slug: string;
    content: [{
      __typename: string;
    }];
    metadata: SeoMetadata;
    locale: string;
    updatedAt: string;
    localizations?: {
      data: Localizations[];
    };
  };
}

export interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    short_description: string;
    thumbnail: {
      data: UploadFile
    };
    cover: {
      data?: UploadFile
    };
    content: string;
    author: string;
    metadata: SeoMetadata;
    updatedAt?: string;
    publishedAt?: string;
    localizations?: {
      data: Localizations[];
    };
  }
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
    mapbox_public_key?: string;
    paypal_client_id?: string;
    google_tag_id?: string;
    default_currency: string;
    currencies: string[];
    provide_support_script?: string;
  };
}

export interface Menu {
  attributes: {
    header: Header;
    footer: Footer;
  };
}

export interface Header {
  id: number;
  logo: {
    data: UploadFile;
  };
  logo_link: string;
  items: HeaderItem[];
}

export interface HeaderItem {
  id: number;
  link: LinkInterface;
  sublinks: LinkInterface[];
}

export interface Footer {
  id: number;
  columns: FooterColumn[];
  copyright: string;
}

export interface FooterColumn {
  id: number;
  logo: {
    data?: UploadFile;
  };
  title: string;
  description?: string;
  socials: LinkInterface[];
  links: LinkInterface[];
}

export interface LinkInterface {
  id: number;
  name: string;
  href: string;
  open_new_tab: boolean;
  icon?: string;
  style: ENUM_ELEMENTS_LINK_STYLE;
  direction: ENUM_ELEMENTS_LINK_DIRECTION;
  variant: ENUM_ELEMENTS_LINK_VARIANT;
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

export interface ProductPrice {
  currency: string;
  price: number;
  sale_price?: number;
  on_sale_from?: string;
  on_sale_to?: string;
  currency_symbol: string;
  details: {
    line_name: string;
    amount: number;
  }[];
  paypal_plan_id?: string;
}

export interface OrderProducts {
  id: number;
  title: string;
  price: number;
  qty: number;
  size: string;
  sizeId: number;
  color?: string;
}

export type localeProps = {
  i18NLocales: {
    data: [
      {
        attributes: {
          code: string;
          name: string;
        };
      }
    ];
  };
};

export interface UploadFile {
  id: number;
  attributes: {
    alternativeText?: string;
    caption?: string;
    name?: string;
    url: string;
    width: number;
    height: number;
    mime: string;
  };
}

export interface Media {
  id: number;
  attributes: {
    name: string;
    slug: string;
    media: {
      data?: UploadFile;
    };
    thumbnail: {
      data?: UploadFile;
    };
    ext_video?: {
      provider: string;
      providerUid: string;
      url: string;
    };
    metadata: SeoMetadata;
    updatedAt: string;
    localizations: {
      data: Localizations[];
    };
  }
}

export interface QueryMetaProps {
  pagination?: {
    page: number;
    pageCount: number;
  }
}

interface DefaultSeoMetadata {
  title?: string;
  siteName?: string;
  description?: string;
}

interface SeoMetadata {
  template_title?: string;
  title_suffix?: string;
  meta_description?: string;
}

export interface Localizations {
  attributes: {
    locale: string;
    slug: string;
  };
}

export enum ENUM_ORDER_STATUS {
  succeeded = 'succeeded',
  processing = 'processing',
  pending = 'pending',
  checkout = 'checkout',
  failed = 'failed',
  canceled = 'canceled',
}

export enum PAYMENT_PROVIDER {
  STRIPE = 'STRIPE',
}

export enum ENUM_ELEMENTS_LINK_STYLE {
  primary = 'primary',
  underline = 'underline',
  button = 'button',
  icon = 'icon',
  arrow = 'arrow',
  none = 'none',
}

export enum ENUM_ELEMENTS_LINK_DIRECTION {
  left = 'left',
  right = 'right',
}

export enum ENUM_ELEMENTS_LINK_VARIANT {
  primary = 'primary',
  outline = 'outline',
  ghost = 'ghost',
  light = 'light',
  dark = 'dark',
}

export enum ENUM_MAX_WIDTH_SCREEN {
  'default' = '',
  'none' = 'max-w-none',
  'max_w_screen_sm' = 'max-w-screen-sm',
  'max_w_screen_md' = 'max-w-screen-md',
  'max_w_screen_lg' = 'max-w-screen-lg',
  'max_w_screen_xl' = 'max-w-screen-xl',
  'max_w_screen_2xl' = 'max-w-screen-2xl',
}

export interface Redirection {
  attributes: {
    newPath: string;
    oldPath: string;
    type: REDIRECTIONS;
  }
}

export enum REDIRECTIONS {
  "permanent_redirect" = "permanent_redirect",
  "temporary_redirect" = "temporary_redirect",
  "rewrite" = "rewrite"
}