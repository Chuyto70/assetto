import { formatISO, parseISO } from 'date-fns';
import { Metadata } from 'next';

import {
  QueryAllPaths,
  QueryIdFromSlug,
  QueryPageSeo,
  QuerySettings,
} from '@/lib/graphql';
import { seo } from '@/lib/seo';

export async function generateStaticParams() {
  const data = await QueryAllPaths();

  const productParams = data.products.data.map((product) => {
    const { slug, locale } = product.attributes;
    const slugArray = !slug ? false : slug.split('/').filter((s) => s !== '');
    return {
      lang: locale,
      slug: slugArray,
    };
  });

  const categoryParams = data.categories.data.map((category) => {
    const { slug, locale } = category.attributes;
    const slugArray = !slug ? false : slug.split('/').filter((s) => s !== '');
    return {
      lang: locale,
      slug: slugArray,
    };
  });

  const pageParams = data.pages.data.map((page) => {
    const { slug, locale } = page.attributes;
    const slugArray = !slug ? false : slug.split('/').filter((s) => s !== '');
    return {
      lang: locale,
      slug: slugArray,
    };
  });

  const params = [...productParams, ...categoryParams, ...pageParams];
  return params;
}

// TODO: Add metadata for products and categories

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}): Promise<Metadata> {
  const { data } = await QueryPageSeo(lang, slug);

  if (data.length <= 0) return seo();

  const { seo: defaultSeo } = await QuerySettings(lang);

  const {
    metadata: meta,
    slug: path,
    localizations,
    updatedAt,
  } = data[0].attributes;

  const metadata = seo({
    ...defaultSeo,
    templateTitle: meta.template_title,
    titleSuffix: meta.title_suffix,
    description: meta.meta_description || defaultSeo.description,
    path: path,
    date: formatISO(parseISO(updatedAt)),
    localizations: localizations,
  });
  return metadata;
}

export default async function SlugLayout({
  children,
  product,
  category,
  params: { lang, slug },
}: {
  children: React.ReactNode;
  product: React.ReactNode;
  category: React.ReactNode;
  params: { lang: string; slug: string[] };
}) {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
    ? slug.join('/')
    : Array.of(slug).join('/');
  const data = await QueryIdFromSlug(lang, slug);
  const currentProduct = data.products.data.find((product) =>
    product.attributes.slug === joinedSlug ? product.id : false
  );
  const currentCategory = data.categories.data.find((cat) =>
    cat.attributes.slug === joinedSlug ? cat.id : false
  );

  // If slug is a product -> @product
  if (currentProduct && !currentCategory) return <>{product}</>;

  // If slug is a category -> @category
  if (!currentProduct && currentCategory) return <>{category}</>;

  // else -> page.tsx
  return <>{children}</>;
}
