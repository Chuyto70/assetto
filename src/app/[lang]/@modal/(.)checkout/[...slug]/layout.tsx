import { QueryIdFromSlug } from "@/lib/graphql";

export default async function CheckoutSlugLayout({
  children,
  product,
  params: { lang, slug },
}: {
  children: React.ReactNode;
  product: React.ReactNode;
  params: { lang: string; slug: string[] };
}) {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
      ? slug.join('/')
      : Array.of(slug).join('/');
  const data = await QueryIdFromSlug(lang, slug);
  const currentProduct = data.products.data.find((prod) =>
    prod.attributes.slug === joinedSlug ? prod.id : false
  );

  // If slug is a product -> @product
  if (currentProduct) return <>{product}</>;
  // else -> page.tsx
  else return <>{children}</>;
}
