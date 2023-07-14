
import { gql, QueryContentComponent } from "@/lib/graphql";
import { ENUM_ELEMENTS_LINK_DIRECTION, ENUM_ELEMENTS_LINK_STYLE, ENUM_ELEMENTS_LINK_VARIANT } from "@/lib/interfaces";

import Link from "@/components/elements/links";

import { useServer } from "@/store/serverStore";

const ComponentSectionsCtaNumbers = gql`
  fragment sectionsCtaNumbers on ComponentSectionsCtaNumbers {
    text_1
    firstNumber
    text_2
    secondNumber
    cta_btn{
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
  page: {
    data: {
      attributes: {
        content: {
          text_1: string;
          firstNumber: number;
          text_2?: string;
          secondNumber: number;
          cta_btn: {
            name: string;
            href: string;
            open_new_tab: boolean;
            icon?: string;
            style: ENUM_ELEMENTS_LINK_STYLE;
            direction: ENUM_ELEMENTS_LINK_DIRECTION;
            variant: ENUM_ELEMENTS_LINK_VARIANT;
          }
        }[];
      };
    };
  };
};


const CtaNumbers = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsCtaNumbers, 'sectionsCtaNumbers');
  const { text_1, firstNumber, text_2, secondNumber, cta_btn } = content[props.index];

  return (
    <section className="relative w-full overflow-hidden border-y-2 border-carbon-900 dark:border-white bg-white dark:bg-carbon-900">
      <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-600 w-60 h-60'></span>
      <div className="w-full flex justify-center bg-carbon-200/40 dark:bg-carbon-600/40 backdrop-blur-200">
        <div className="w-full lg:max-w-screen-2xl p-3 md:p-6 lg:px-12 flex flex-col gap-6">
          <div className="w-full flex flex-col xs:flex-row items-center justify-between gap-3">
            <h3 className="w-full text-center font-semibold">{text_1.replace('${firstNumber}', firstNumber.toString())}</h3>
            {text_2 && <h3 className="w-full text-center font-semibold">{text_2.replace('${secondNumber}', secondNumber.toString())}</h3>}
          </div>
          <div className="w-full flex justify-center">
            {cta_btn.style === 'button' && cta_btn.direction === 'right' ? <Link
              href={cta_btn.href}
              openNewTab={cta_btn.open_new_tab}
              style={cta_btn.style}
              variant={cta_btn.variant}
              rightIcon={cta_btn.icon}
              className="bg-primary-600 text-white font-semibold text-lg md:text-2xl"
              size="lg"
            >
              {cta_btn.name}
            </Link> :
              cta_btn.style === 'button' && cta_btn.direction === 'left' ? <Link
                href={cta_btn.href}
                openNewTab={cta_btn.open_new_tab}
                style={cta_btn.style}
                variant={cta_btn.variant}
                leftIcon={cta_btn.icon}
                className="bg-primary-600 text-white font-semibold text-lg md:text-2xl"
                size="lg"
              >
                {cta_btn.name}
              </Link> :
                <Link
                  href={cta_btn.href}
                  openNewTab={cta_btn.open_new_tab}
                  style={cta_btn.style}
                  variant={cta_btn.variant}
                  icon={cta_btn.icon}
                >
                  {cta_btn.name}
                </Link>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaNumbers;