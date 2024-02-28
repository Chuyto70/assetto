import SectionLink from "@/components/elements/links/SectionLink";
import Benefits from "@/components/sections/Benefits";
import Carousel from "@/components/sections/Carousel";
import CarouselAlt from "@/components/sections/CarouselAlt";
import Categories from "@/components/sections/Categories";
import Contact from "@/components/sections/Contact";
import CtaNumbers from "@/components/sections/CtaNumbers";
import Display from "@/components/sections/Display";
import Faq from "@/components/sections/Faq";
import GameRequest from "@/components/sections/GameRequest";
import LatestArticles from "@/components/sections/LatestArticles";
import LatestTutorials from "@/components/sections/LatestTutorials";
import MapSection from "@/components/sections/MapSection";
import MdxBlock from "@/components/sections/MdxBlock";
import MediaCarousel from "@/components/sections/MediaCarousel";
import MediaGrid from "@/components/sections/MediaGrid";
import MediaGridAlt from "@/components/sections/MediaGridAlt";
import Preview from "@/components/sections/Preview";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Tutorials from "@/components/sections/Tutorials";
import TypedTitle from "@/components/sections/TypedTitle";

export type sectionTypeProps = {
  __typename: keyof typeof sectionComponents;
};

// Map Strapi sections to section components
const sectionComponents = {
  ComponentSectionsTypedTitle: TypedTitle,
  ComponentSectionsMdxBlock: MdxBlock,
  ComponentSectionsCarousel: Carousel,
  ComponentSectionsCarouselAlt: CarouselAlt,
  ComponentSectionsServices: Services,
  ComponentSectionsCtaNumbers: CtaNumbers,
  ComponentSectionsFaq: Faq,
  ComponentSectionsCategories: Categories,
  ComponentSectionsGameRequest: GameRequest,
  ComponentSectionsMediaGrid: MediaGrid,
  ComponentSectionsMediaGridAlt: MediaGridAlt,
  ComponentSectionsMediaCarousel: MediaCarousel,
  ComponentSectionsMap: MapSection,
  ComponentSectionsContact: Contact,
  ComponentSectionsLatestArticles: LatestArticles,
  ComponentSectionsPreview: Preview,
  ComponentSectionsBenefits: Benefits,
  ComponentSectionsDisplay: Display,
  ComponentSectionsTutorials: Tutorials,
  ComponentSectionsTestimonials: Testimonials,
  ComponentSectionsLatestTutorials: LatestTutorials,
  // Elements
  ComponentElementsLink: SectionLink,
};

// Display a section individually
const Section = (props: {
  sectionType: sectionTypeProps;
  pageType: string;
  index: number;
  pageID: number;
}) => {

  // Prepare the component
  const SectionComponent = sectionComponents[props.sectionType.__typename];

  if (!SectionComponent) {
    return null;
  }

  // Display the section
  return <SectionComponent pageID={props.pageID} index={props.index} pageType={props.pageType} />;
};

// Display the list of sections
const Sections = (props: { sections: [sectionTypeProps]; pageID: number; pageType?: string; }) => {
  return (
    <>
      {/* Show the actual sections */}
      {props.sections?.map((section: sectionTypeProps, index) => (
        <Section
          sectionType={section}
          pageType={props.pageType ?? 'page'}
          index={index}
          pageID={props.pageID}
          key={`${section.__typename}${index}`}
        />
      ))}
    </>
  );
};

export default Sections;
