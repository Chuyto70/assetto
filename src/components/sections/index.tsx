import SelectedList from '@/components/sections/products/SelectedList';

type sectionTypeProps = {
  __typename: keyof typeof sectionComponents;
};

// Map Strapi sections to section components
const sectionComponents = {
  ComponentSectionsProductSelectedList: SelectedList,
};

// Display a section individually
const Section = (props: {
  sectionType: sectionTypeProps;
  index: number;
  pageID: number;
  locale: string;
}) => {
  // Prepare the component
  const SectionComponent = sectionComponents[props.sectionType.__typename];

  if (!SectionComponent) {
    return null;
  }

  // Display the section
  return (
    <SectionComponent
      pageID={props.pageID}
      index={props.index}
      locale={props.locale}
    />
  );
};

// Display the list of sections
const Sections = (props: { sections: []; pageID: number; locale: string }) => {
  return (
    <>
      {/* Show the actual sections */}
      {props.sections?.map((section: sectionTypeProps, index) => (
        <Section
          sectionType={section}
          index={index}
          pageID={props.pageID}
          locale={props.locale}
          key={`${section.__typename}${index}`}
        />
      ))}
    </>
  );
};

export default Sections;
