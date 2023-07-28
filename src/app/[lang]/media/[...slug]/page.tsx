import { QueryMediaFromSlug } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

import NextImage from "@/components/NextImage";

import notFound from "@/app/[lang]/not-found";

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { medias } = await QueryMediaFromSlug(lang, ['media', ...slug]);
  const data = medias.data;
  if (data.length <= 0) return notFound({ lang, slug });

  const media = medias.data[0];
  const { ext_video, media: uploadFile } = media.attributes;

  if (uploadFile.data && uploadFile.data.attributes.mime.startsWith('image/')) {
    return <div className="max-w-screen-3xl">
      <NextImage
        useSkeleton
        src={MediaUrl(uploadFile.data.attributes.url)}
        width={uploadFile.data.attributes.width}
        height={uploadFile.data.attributes.height}
        alt={uploadFile.data.attributes.alternativeText ?? ''}
        quality={100}
        className="w-full"
      />
    </div>
  }

  if (uploadFile.data && uploadFile.data.attributes.mime.startsWith('video/')) {
    return <div className="h-[80vh] max-w-full aspect-video">
      <video
        autoPlay={true}
        controls={true}
        loop={false}
        muted={false}
        width={uploadFile.data.attributes.width}
        height={uploadFile.data.attributes.height}
        className="max-w-full"
      >
        <source
          src={MediaUrl(uploadFile.data.attributes.url)}
          type={uploadFile.data.attributes.mime}
        />
        <meta itemProp='name' content={uploadFile.data.attributes.name} />
        <meta
          itemProp='description'
          content={uploadFile.data.attributes.alternativeText}
        />
      </video>
    </div>
  }

  return <div className="h-[80vh] max-w-full aspect-video">
    {ext_video && (
      ext_video.provider && ext_video.providerUid && (
        ext_video.provider === "vimeo" && (
          <iframe
            src={`https://player.vimeo.com/video/${ext_video.providerUid}`}
            allowFullScreen
            frameBorder="0"
            width="100%"
            height="100%"

            className='aspect-video h-full'
          ></iframe>
        ) ||
        ext_video.provider === "youtube" && (
          <iframe
            src={`https://www.youtube.com/embed/${ext_video.providerUid}?modestbranding=1&autoplay=1`}
            allowFullScreen
            allow="autoplay; encrypted-media"
            frameBorder="0"
            width="100%"
            height="100%"

            className='aspect-video h-full'
          ></iframe>
        ) ||
        ext_video.provider === "facebook" && (
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${ext_video.providerUid}&show_text=false&t=0`}
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            frameBorder="0"
            width="100%"
            height="100%"

            className='aspect-video h-full'
          />
        )
      )
    )}
  </div>
}
