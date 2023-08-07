
import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { LinkInterface, UploadFile } from "@/lib/interfaces";

import Link from "@/components/elements/links";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsPreview = gql`
  fragment sectionPreview on ComponentSectionsPreview {
    title
    description
    link {
      name
      href
      open_new_tab
      icon
      style
      direction
      variant
    }
    image_1 {
      data {
        attributes {
          name
          alternativeText
          caption
          width
          height
          url
          mime
        }
      }
    }
    image_2 {
      data {
        attributes {
          name
          alternativeText
          caption
          width
          height
          url
          mime
        }
      }
    }
    image_3 {
      data {
        attributes {
          name
          alternativeText
          caption
          width
          height
          url
          mime
        }
      }
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title: string;
        description: string;
        link: LinkInterface;
        image_1: {
          data: UploadFile;
        };
        image_2: {
          data: UploadFile;
        };
        image_3: {
          data: UploadFile;
        };
      }[];
    };
  };
};


const Preview = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsPreview, 'sectionPreview');
  const { title, description, link, image_1, image_2, image_3 } = content[props.index];

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 lg:max-w-screen-2xl flex flex-col lg:flex-row items-center gap-6 md:gap-12">
      <div className="lg:w-3/5 flex flex-col items-center lg:items-start lg:justify-center gap-3 md:gap-6">
        <h1 className="text-center lg:text-left italic">{title}</h1>
        <p className="text-center lg:text-left">{description}</p>
        <Link
          href={link.href}
          openNewTab={link.open_new_tab}
          style={link.style}
          variant={link.variant}
          icon={link.icon}
          direction={link.direction}
          size="lg"
        >{link.name}</Link>
      </div>
      <div className="xs:w-4/5 lg:w-2/5 grid grid-cols-4 grid-rows-3 gap-3 md:gap-6">
        <NextImage
          useSkeleton
          src={MediaUrl(image_1.data.attributes.url)}
          width={image_1.data.attributes.width ?? 0}
          height={image_1.data.attributes.height ?? 0}
          alt={image_1.data.attributes.alternativeText ?? ''}
          className="col-start-1 row-start-1 col-span-2 row-span-2 w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
          imgClassName='object-cover object-center w-full h-full'
        />
        <NextImage
          useSkeleton
          src={MediaUrl(image_2.data.attributes.url)}
          width={image_2.data.attributes.width ?? 0}
          height={image_2.data.attributes.height ?? 0}
          alt={image_2.data.attributes.alternativeText ?? ''}
          className="col-start-3 row-start-1 col-span-2 row-span-2 w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
          imgClassName='object-cover object-center w-full h-full'
        />
        <NextImage
          useSkeleton
          src={MediaUrl(image_3.data.attributes.url)}
          width={image_3.data.attributes.width ?? 0}
          height={image_3.data.attributes.height ?? 0}
          alt={image_3.data.attributes.alternativeText ?? ''}
          className="col-start-2 row-start-2 col-span-2 row-span-2 w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900 shadow-carbon-900-around"
          imgClassName='object-cover object-center w-full h-full'
        />
      </div>
    </section>
  )
}

export default Preview;