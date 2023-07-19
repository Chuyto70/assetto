import { gql, QueryContentComponent } from "@/lib/graphql";

import GameRequestForm from "@/components/elements/forms/GameRequestForm";

import { useServer } from "@/store/serverStore";

const ComponentSectionsGameRequest = gql`
  fragment sectionsGameRequest on ComponentSectionsGameRequest {
    title
    btn_text
    email_placeholder
    game_placeholder
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          title: string;
          btn_text: string;
          email_placeholder: string;
          game_placeholder: string;
        }[];
      };
    };
  };
};


const GameRequest = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsGameRequest, 'sectionsGameRequest');
  const { title, btn_text, email_placeholder, game_placeholder } = content[props.index];


  return (
    <section className="w-full max-w-screen-sm px-3 md:px-6 lg:px-12 flex flex-col items-center justify-center gap-3 md:gap-6">
      <h2 className="text-center italic">{title}</h2>
      <GameRequestForm
        submitText={btn_text}
        placeholder={{ email: email_placeholder, game: game_placeholder }}
        className="w-full flex flex-col gap-3 items-center"
      />
    </section>
  )
}

export default GameRequest;