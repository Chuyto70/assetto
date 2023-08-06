
import { gql, QueryContentComponent, QueryLatestArticle } from "@/lib/graphql";

import ArticlesList from "@/components/elements/articles/ArticlesList";
import StatusText, { StatusEnum } from "@/components/elements/texts/StatusText";

import { useServer } from "@/store/serverStore";

const ComponentSectionsLatestArticles = gql`
  fragment sectionLatestArticles on ComponentSectionsLatestArticles {
    title
    status
    status_icon
    status_text
    page_size
    btn_text
    link_text
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          title?: string;
          status: StatusEnum;
          status_icon?: string;
          status_text?: string;
          page_size: number;
          btn_text: string;
          link_text: string;
        }[];
      };
    };
  };
};


const LatestArticles = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsLatestArticles, 'sectionLatestArticles');
  const { title, status, status_icon, status_text, page_size, btn_text, link_text } = content[props.index];

  const { data: articles, meta } = await QueryLatestArticle(locale, 1, page_size);

  return (
    <section className="w-full max-w-screen-xl px-3 md:px-6 lg:px-12 flex flex-col items-center gap-3 md:gap-6">
      {title && <h2 className="italic">{title}</h2>}
      {status_text && <StatusText className="text-md" status={status} icon={status_icon} ><p className="font-semibold">{status_text}</p></StatusText>}

      <ArticlesList
        articles={articles}
        pageSize={page_size}
        pageCount={meta.pagination?.pageCount}
        loadMoreText={btn_text}
        linkText={link_text}
      />
    </section>
  )
}

export default LatestArticles;