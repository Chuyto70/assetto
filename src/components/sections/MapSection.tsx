import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent, QuerySettings } from "@/lib/graphql";
import { LinkInterface } from "@/lib/interfaces";

import Mapbox from "@/components/elements/map/Mapbox";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMap = gql`
  fragment sectionsMap on ComponentSectionsMap {
    title
    description
    latitude
    longitude
    zoom
    style
    markers {
      id
      name
      latitude
      longitude
      color
      link {
        id
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
        title?: string;
        description?: string;
        latitude: number;
        longitude: number;
        zoom: number;
        style: string;
        markers: {
          id: number;
          name: string;
          latitude: number;
          longitude: number;
          color: string;
          link?: LinkInterface;
        }[];
      }[];
    };
  };
};

const MapSection = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { mapbox_public_key } = await QuerySettings(locale);
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsMap, 'sectionsMap');
  const { title, description, latitude, longitude, zoom, style, markers } = content[props.index];

  return (
    <section className="w-full flex flex-col items-center gap-6">
      <div className="px-3 md:px-6 lg:px-12 w-full max-w-screen-2xl flex flex-col items-center text-center md:text-left gap-3 md:flex-row md:justify-between lg:gap-6">
        {title && <h2 className="italic md:w-1/2">{title}</h2>}
        {description && <p className={clsxm("md:w-1/2 text-carbon-700 dark:text-carbon-400", title && 'md:text-right')}>{description}</p>}
      </div>
      {mapbox_public_key && <Mapbox
        mapbox_public_key={mapbox_public_key}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        style={style}
        markers={markers}
        className="max-w-screen-3xl w-full h-[500px]"
      />}
    </section>
  )
}

export default MapSection;