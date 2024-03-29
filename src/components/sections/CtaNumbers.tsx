import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink } from "@/lib/helper";
import { LinkInterface } from "@/lib/interfaces";

import Link from "@/components/elements/links";
import Count from "@/components/elements/texts/Count";

import { useServer } from "@/store/serverStore";

const ComponentSectionsCtaNumbers = gql`
  fragment sectionsCtaNumbers on ComponentSectionsCtaNumbers {
    text_1
    text_2
    cta_btn{
      name
      href
      open_new_tab
      icon
      style
      direction
      variant
      relationship
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        text_1: string;
        text_2?: string;
        cta_btn?: LinkInterface;
      }[];
    };
  };
};


const CtaNumbers = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsCtaNumbers, 'sectionsCtaNumbers');
  const { text_1, text_2, cta_btn } = content[props.index];

  const text1WithCounter = text_1.split(/\${([^}]*)}/).map((item, index) => {
    if (index % 2 === 0) return <span key={index}>{item}</span>;
    else if (!isNaN(Number.parseInt(item))) {
      return <Count key={index} value={Number.parseInt(item)} className="text-primary-600">{item}</Count>;
    } else return <span key={index} className="text-primary-600">{item}</span>;
  });

  const text2WithCounter = text_2?.split(/\${([^}]*)}/).map((item, index) => {
    if (index % 2 === 0) return <span key={index}>{item}</span>;
    else if (!isNaN(Number.parseInt(item))) {
      return <Count key={index} value={Number.parseInt(item)} className="text-primary-600">{item}</Count>;
    } else return <span key={index} className="text-primary-600">{item}</span>;
  });

  return (
    <section className="relative w-full overflow-hidden border-y-2 border-carbon-900 dark:border-white bg-white dark:bg-carbon-900">
      <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1024px] h-[1024px] bg-no-repeat bg-center bg-contain' style={{ backgroundImage: "url(/images/rond-violet.avif)" }}></span>
      <div className="relative w-full flex justify-center bg-carbon-200/40 dark:bg-carbon-600/40">
        <div className="w-full lg:max-w-screen-2xl p-3 md:p-6 lg:px-12 flex flex-col gap-6">
          <div className="w-full flex flex-col xs:flex-row items-center justify-between gap-3">
            <h3 className="w-full text-center font-semibold">{text1WithCounter}</h3>
            {text2WithCounter && <h3 className="w-full text-center font-semibold">{text2WithCounter}</h3>}
          </div>
          {cta_btn && <div className="w-full flex justify-center">
            {cta_btn.style === 'button' && <Link
              title={cta_btn.name}
              href={includeLocaleLink(cta_btn.href)}
              openNewTab={cta_btn.open_new_tab}
              style={cta_btn.style}
              variant={cta_btn.variant}
              rel={cta_btn.relationship}
              icon={cta_btn.icon}
              direction={cta_btn.direction}
              className="bg-primary-600 text-white font-semibold text-lg md:text-2xl"
              size="lg"
            >
              {cta_btn.name}
            </Link>}
          </div>}
        </div>
      </div>
    </section>
  )
}

export default CtaNumbers;