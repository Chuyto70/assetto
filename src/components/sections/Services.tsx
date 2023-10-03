import Image from "next/image";

import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { UploadFile } from "@/lib/interfaces";

import { useServer } from "@/store/serverStore";

const ComponentSectionsServices = gql`
  fragment sectionsServices on ComponentSectionsServices {
    title
    description
    services {
      id
      icon {
        data {
          attributes {
            alternativeText
            width
            height
            url
          }
        }
      }
      title
      description
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title?: string;
        description?: string;
        services: {
          id: number;
          icon: {
            data?: UploadFile;
          }
          title: string;
          description: string;
        }[];
      }[];
    };
  };
};


const Services = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsServices, 'sectionsServices');
  const { title, description, services } = content[props.index];

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 lg:max-w-screen-2xl flex flex-col gap-6">
      <div className="flex flex-col items-center text-center md:text-left gap-3 md:flex-row md:justify-between lg:gap-6">
        {title && <h2 className="italic md:w-1/2">{title}</h2>}
        {description && <p className={clsxm("md:w-1/2 text-carbon-700 dark:text-carbon-400", title && 'md:text-right')}>{description}</p>}
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {services.map((service) => (
          <div key={service.id}
            className="flex flex-col gap-3 p-3 md:p-6 rounded-3xl border-2 border-carbon-900 dark:border-white"
          >
            {service.icon.data && <div className="w-full flex justify-center">
              <Image
                className="h-20 w-20 object-center object-cover hover:animate-spin"
                width={service.icon.data.attributes.width}
                height={service.icon.data.attributes.height}
                src={MediaUrl(service.icon.data.attributes.url)}
                alt={service.icon.data.attributes.alternativeText ?? ''}
                sizes="50vw"
              />
            </div>}
            <h3>{service.title}</h3>
            <p className="text-carbon-700 dark:text-carbon-400">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services;