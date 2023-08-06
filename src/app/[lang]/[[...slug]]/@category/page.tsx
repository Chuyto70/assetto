import { QueryCategoryFromSlug } from "@/lib/graphql";

import Sections, { sectionTypeProps } from "@/components/sections";

import notFound from "@/app/[lang]/not-found";

const CategoryPage = async ({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) => {
  const { data } = await QueryCategoryFromSlug(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { title, description, content } = data[0].attributes;

  return (
    <>
      <section className="w-full max-w-screen-md px-3 md:px-6 lg:px-12 flex flex-col items-center justify-center gap-3 md:gap-6 text-center">
        <h1 className="italic">{title}</h1>
        <p className="text-carbon-700 dark:text-carbon-400">{description}</p>
      </section>
      <Sections sections={content as unknown as [sectionTypeProps]} pageID={pageID} />
    </>
  );
};

export default CategoryPage;
