import { formatISO, parseISO } from 'date-fns';
import { Metadata } from 'next';

import {
  QueryAllPaths,
  QueryIdFromSlug,
  QuerySeo,
  QuerySettings,
} from '@/lib/graphql';
import { Category, Page, Product } from '@/lib/interfaces';
import { seo } from '@/lib/seo';

export async function generateStaticParams() {
  const data = await QueryAllPaths();

  function mapData(dataArray: (Product | Category | Page)[]) {
    return dataArray.map(({ attributes: { slug, locale } }) => {
      const slugArray = slug ? slug.split('/').filter((s) => s !== '') : false;
      return {
        lang: locale,
        slug: slugArray,
      };
    });
  }

  const params = [
    ...mapData(data.products.data),
    ...mapData(data.categories.data),
    ...mapData(data.pages.data),
  ];

  return params;
}

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}): Promise<Metadata> {
  const { pages, products, categories } = await QuerySeo(lang, slug);
  const { seo: defaultSeo } = await QuerySettings(lang);

  if (!pages.data.length && !products.data.length && !categories.data.length)
    return seo({ ...defaultSeo });

  const data = products.data.length
    ? products.data
    : categories.data.length
    ? categories.data
    : pages.data;

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
