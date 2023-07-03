import dynamic from 'next/dynamic';

type sectionTypeProps = {
  __typename: keyof typeof sectionComponents;
};

// Map Strapi sections to section components
const sectionComponents = {
  ComponentSectionsProductSelectedList: dynamic(
    () => import('@/components/sections/products/SelectedList')
  ),
  ComponentSectionsCart: dynamic(
    () => import('@/components/sections/checkout/CartWrapper')
  ),
  ComponentSectionsCheckoutTunnel: dynamic(
    () => import('@/components/sections/checkout/CheckoutTunnel')
  ),
  ComponentSectionsCheckoutComplete: dynamic(
    () => import('@/components/sections/checkout/CheckoutComplete')
  ),
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
const Sections = (props: { sections: []; pageID: number }) => {
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
