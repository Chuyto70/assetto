import { gql, QueryContentComponent } from "@/lib/graphql";

import Typed from "@/components/elements/texts/Typed";

import { useServer } from "@/store/serverStore";

const ComponentSectionsTypedTitle = gql`
  fragment sectionsTypedTitle on ComponentSectionsTypedTitle {
    titles {
      text
    }
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          titles: {
            text: string;
          }[];
        }[];
      };
    };
  };
};


const TypedTitle = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsTypedTitle, 'sectionsTypedTitle');
  const { titles } = content[props.index];

  return (
    <h1 className="text-center max-w-full h-16 md:h-20 xs:max-w-screen-xs md:max-w-screen-sm my-3 px-3 md:my-6 md:px-6 lg:px-12 line-clamp-2">
      <Typed texts={titles.map(el => el.text)}>
        {titles[0].text}
      </Typed>
    </h1>
  )
}

export default TypedTitle;