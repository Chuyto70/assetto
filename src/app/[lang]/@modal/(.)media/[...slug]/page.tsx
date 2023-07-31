

import { QueryMediaFromSlug } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import Modal from '@/components/elements/modal/Modal';
import NextImage from '@/components/NextImage';

async function MediaModal({
  params: { slug, lang },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { medias } = await QueryMediaFromSlug(lang, slug);
  const media = medias.data[0];
  const { ext_video, media: uploadFile } = media.attributes;

  if (uploadFile.data?.attributes.mime.startsWith('image/')) {
    return <Modal dismissBack={true}>
      <NextImage
        useSkeleton
        src={MediaUrl(uploadFile.data.attributes.url)}
        width={uploadFile.data.attributes.width}
        height={uploadFile.data.attributes.height}
        alt={uploadFile.data.attributes.alternativeText ?? ''}
        quality={100}
        className="object-contain w-full"
      />
    </Modal>
  } else if (uploadFile.data?.attributes.mime.startsWith('video/')) {
    return <Modal dismissBack={true}
      className='aspect-video'
    >
      <video
        autoPlay={true}
        controls={true}
        loop={false}
        muted={false}
        width={uploadFile.data.attributes.width}
        height={uploadFile.data.attributes.height}
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
    </Modal>
  } else if (ext_video) {
    return <Modal dismissBack={true}
      className='aspect-video h-fit'
    >
      {ext_video.provider && ext_video.providerUid && (
        ext_video.provider === "vimeo" && (
          <iframe
            src={`https://player.vimeo.com/video/${ext_video.providerUid}`}
            allowFullScreen
            frameBorder="0"
            width="100%"
            height="100%"

            className='h-full w-full'
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

            className='h-full w-full'
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

            className='h-full w-full'
          />
        )
      )}
    </Modal>
  } else return null;
}

export default MediaModal;