import Image from "next/image";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

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
  page: {
    data: {
      attributes: {
        content: {
          title?: string;
          description?: string;
          services: {
            id: number;
            icon: {
              data?: Media;
            }
            title: string;
            description: string;
          }[];
        }[];
      };
    };
  };
};


const Services = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsServices, 'sectionsServices');
  const { title, description, services } = content[props.index];

  return (
    <section className="w-full px-3 lg:px-6 max-w-screen-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between lg:gap-6">
        {title && <h2 className="italic uppercase">{title}</h2>}
        {description && <p className="text-carbon-700 dark:text-carbon-400">{description}</p>}
      </div>
      <div className="flex flex-col gap-3 lg:gap-6">
        {services.map((service) => (
          <div key={service.id}
            className="flex flex-col gap-3 p-3 rounded-3xl border-2 border-carbon-900 dark:border-white"
          >
            {service.icon.data && <div className="w-full flex justify-center">
              <Image
                className="h-20 w-20 object-center object-cover brightness-75"
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