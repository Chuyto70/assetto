
import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { LinkInterface, UploadFile } from "@/lib/interfaces";

import Link from "@/components/elements/links";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsBenefits = gql`
  fragment sectionBenefits on ComponentSectionsBenefits {
    title
    benefits {
      id
      icon {
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
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title: string;
        benefits: {
          id: number;
          icon: {
            data?: UploadFile;
          };
          title: string;
          description: string;
          link?: LinkInterface;
        }[];
      }[];
    };
  };
};


const Benefits = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsBenefits, 'sectionBenefits');
  const { title, benefits } = content[props.index];

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
      <h2 className="italic text-center">{title}</h2>
      <div className={clsxm("w-full grid grid-cols-1 gap-6 md:gap-12",
        benefits.length > 1 && 'xs:grid-cols-2',
        benefits.length > 2 && 'lg:grid-cols-3'
      )}>
        {benefits.map((benefit) => (
          <div key={benefit.id}
            className="flex flex-col items-center gap-3 justify-between"
          >
            <div className="flex flex-col items-center gap-3">
              {benefit.icon.data && <NextImage
                src={MediaUrl(benefit.icon.data.attributes.url)}
                width={benefit.icon.data.attributes.width ?? 0}
                height={benefit.icon.data.attributes.height ?? 0}
                alt={benefit.icon.data.attributes.alternativeText ?? ''}
                className="w-10 aspect-square"
                imgClassName='object-cover object-center w-full h-full'
              />}
              <h3>{benefit.title}</h3>
              <div className="prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md"><RemoteMDX source={benefit.description} /></div>
            </div>

            {benefit.link && <Link
              href={includeLocaleLink(benefit.link.href)}
              openNewTab={benefit.link.open_new_tab}
              style={benefit.link.style}
              variant={benefit.link.variant}
              icon={benefit.link.icon}
              direction={benefit.link.direction}
            >{benefit.link.name}</Link>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Benefits;