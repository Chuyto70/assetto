import { format, parseISO } from "date-fns";

import { QueryArticleFromSlug } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

import Modal from "@/components/elements/modal/Modal";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

async function ArticleModal({
  params: { slug, lang },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { data } = await QueryArticleFromSlug(lang, slug);
  const { title, cover, author, publishedAt, content } = data[0].attributes;

  return (
    <Modal dismissBack={true}
      className="max-w-screen-2xl"
    >
      <div
        className="bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl pb-3 md:pb-6 overflow-hidden flex flex-col gap-3 md:gap-6"
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
    </Modal>
  )
}

export default ArticleModal;