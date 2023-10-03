import Image from "next/image";

import { QueryUploadFileFromSrc } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

export default (async function ({ src, alt, ...rest }: { src?: string, alt?: string; }) {

  if (!src) return null;

  const { uploadFiles } = await QueryUploadFileFromSrc(src);

  const { alternativeText, width, height } = uploadFiles.data[0].attributes;

  return (
    <Image
      src={MediaUrl(src)}
      alt={alt ?? alternativeText ?? ''}
      width={width ?? 2000}
      height={height ?? 2000}
      quality={75}
      className="rounded-3xl"
      {...rest}
    />
  )
} as unknown as ({
  src,
  alt,
  ...rest
}: {
  src?: string;
  alt?: string;
}) => JSX.Element);
