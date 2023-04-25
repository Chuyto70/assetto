import { Metadata } from "next";

import { openGraph } from "@/lib/helper";

import { deploymentURL } from "@/constant/env"

export const defaultMeta = {
  title: 'Alhéna',
  siteName: 'Alhéna',
  description: 'Alhéna description',
  /** Without additional '/' on the end, e.g. https://sygix.fr */
  url: deploymentURL,
  type: 'website',
  robots: 'follow, index',
  /**
   * No need to be filled, will be populated with openGraph function
   * If you wish to use a normal image, just specify the path below
   */
  image: '',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
  path?: string;
} & Partial<typeof defaultMeta>
  & Metadata;

export const seo = (props: SeoProps): Metadata => {

  const meta = {
    ...defaultMeta,
    ...props,
  };

  meta['path'] = meta.path ? meta.path : '';

  meta['title'] = props.templateTitle
    ? `${props.templateTitle} • ${meta.siteName}`
    : meta.title;

  // ? Uncomment code below if you want to use default open graph
  const ogImage = openGraph({
    description: meta.description ? meta.description : defaultMeta.description,
    siteName: props.templateTitle ? `${props.templateTitle} • ${meta.siteName}` : meta.title,
    templateTitle: props.templateTitle,
  });
  meta['openGraph'] = {
    siteName: meta.siteName,
    description: meta.description,
    title: meta.title,
    images: ogImage,
    url: meta.url+meta.path
  };
  meta['twitter'] = {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: ogImage,
  };
  meta['alternates'] = {
    canonical: meta.url+meta.path
  }
  {meta.date && (meta['other'] = {
    publish_date: meta.date
  })}

  return meta;
};