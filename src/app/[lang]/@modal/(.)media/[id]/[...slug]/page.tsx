import React from 'react'

import { QueryMedia } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import Modal from '@/components/elements/modal/Modal'
import NextImage from '@/components/NextImage';

async function MediaModal({
  params: { id },
}: {
  params: { id: string; slug: string[]; lang: string };
}) {

  const { uploadFile } = await QueryMedia(id);

  if (uploadFile.data.attributes.mime.startsWith('image/')) {
    return <Modal dismissBack={true}
      className='w-fit sm:w-fit md:w-fit lg:w-fit max-w-none'
    >
      <NextImage
        useSkeleton
        src={MediaUrl(uploadFile.data.attributes.url)}
        width={uploadFile.data.attributes.width}
        height={uploadFile.data.attributes.height}
        alt={uploadFile.data.attributes.alternativeText ?? ''}
        className="border-2 border-carbon-900 dark:border-transparent"
      />
    </Modal>
  } else if (uploadFile.data.attributes.mime.startsWith('video/')) {
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
        className='border-2 border-carbon-900 dark:border-transparent'
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
  } else return null;
}

export default MediaModal;