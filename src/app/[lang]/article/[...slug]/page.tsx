import { format, parseISO } from "date-fns";

import { QueryArticleFromSlug } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

import notFound from "@/app/[lang]/not-found";

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { data } = await QueryArticleFromSlug(lang, slug);
  if (data.length <= 0) return notFound({ lang, slug });

  const { title, cover, author, publishedAt, content } = data[0].attributes;

  return (
    <div
      className="w-full max-w-screen-xl pb-3 md:pb-6 overflow-hidden flex flex-col gap-3 md:gap-6"
    >
      <div className="relative w-full h-48 flex justify-center items-center">
        {cover.data && <NextImage
          className='absolute w-full h-full after:absolute after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-carbon-900/40'
          imgClassName='w-full h-full object-cover object-center'
          useSkeleton
          width={cover.data.attributes.width}
          height={cover.data.attributes.height}
          src={MediaUrl(cover.data.attributes.url)}
          alt={cover.data.attributes.alternativeText ?? ''}
        />}
        <h1 className="relative z-10 text-white text-center">{title}</h1>
      </div>

      <div className='w-full flex justify-center gap-1 text-carbon-700 dark:text-carbon-400 font-semibold'>
        <address rel="author">{author}</address>
        <span>-</span>
        <time dateTime={publishedAt}>{format(parseISO(publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
      </div>

      <div className="px-3 md:px-6 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md max-w-full prose-h1:italic ">
        <RemoteMDX source={content} />
      </div>
    </div>
  )

}
