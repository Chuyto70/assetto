import MdxBlock from "@/components/sections/MdxBlock";
import TypedTitle from "@/components/sections/TypedTitle";

export type sectionTypeProps = {
  __typename: keyof typeof sectionComponents;
};

// Map Strapi sections to section components
const sectionComponents = {
  ComponentSectionsTypedTitle: TypedTitle,
  ComponentSectionsMdxBlock: MdxBlock,
};

// Display a section individually
const Section = (props: {
  sectionType: sectionTypeProps;
  index: number;
  pageID: number;
}) => {
  // Prepare the component
  const SectionComponent = sectionComponents[props.sectionType.__typename];

  if (!SectionComponent) {
    return null;
  }

  // Display the section
  return <SectionComponent pageID={props.pageID} index={props.index} />;
};

// Display the list of sections
const Sections = (props: { sections: [sectionTypeProps]; pageID: number }) => {
  return (
    <>
      {/* Show the actual sections */}
      {props.sections?.map((section: sectionTypeProps, index) => (
        <Section
          sectionType={section}
          index={index}
          pageID={props.pageID}
          key={`${section.__typename}${index}`}
        />
      ))}
    </>
  );
};

export default Sections;
