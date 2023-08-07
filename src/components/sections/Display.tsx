
import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { LinkInterface, Media } from "@/lib/interfaces";

import Link from "@/components/elements/links";

import { useServer } from "@/store/serverStore";

const ComponentSectionsDisplay = gql`
  fragment sectionDisplay on ComponentSectionsDisplay {
    title
    description
    medias {
      data {
        id
        attributes {
          slug
          media {
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

          thumbnail {
            data {
              attributes {
                name
                alternativeText
                caption
                width
                height
                url
              }
            }
          }

          ext_video
        }
      }
    }
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
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title?: string;
        description?: string;
        link: LinkInterface;
        medias: {
          data: Media[];
        }
      }[];
    };
  };
};


const Display = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsDisplay, 'sectionDisplay');
  const { title, description, link, medias } = content[props.index];

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 lg:max-w-screen-2xl flex flex-col gap-6">
      <div className="flex flex-col items-center text-center md:text-left gap-3 md:flex-row md:justify-between lg:gap-6">
        {title && <h2 className="italic md:w-1/2">{title}</h2>}
        {description && !link && <p className={clsxm("md:w-1/2 text-carbon-700 dark:text-carbon-400", title && 'md:text-right')}>{description}</p>}
        {link && <Link
          href={link.href}
          openNewTab={link.open_new_tab}
          style={link.style}
          variant={link.variant}
          icon={link.icon}
          direction={link.direction}
          size="lg"
        >{link.name}</Link>}
      </div>

    </section>
  )
}

export default Display;