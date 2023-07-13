import React from 'react'

import { QueryPageFromSlug } from '@/lib/graphql';

import Modal from '@/components/elements/modal/Modal'
import Sections, { sectionTypeProps } from '@/components/sections';

import notFound from '@/app/[lang]/not-found';

async function MediaModal({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {

  const { data } = await QueryPageFromSlug(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { content } = data[0].attributes;

  return (
    <Modal>
      <Sections sections={content as [sectionTypeProps]} pageID={pageID} />
    </Modal>
  )
}

export default MediaModal;