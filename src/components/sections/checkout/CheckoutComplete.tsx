import { gql, QueryContentComponent } from '@/lib/graphql';

import StripeComplete from '@/components/sections/checkout/stripe/StripeComplete';

import { useServer } from '@/store/serverStore';

const ComponentSectionsCheckoutComplete = gql`
  fragment sectionsCheckoutComplete on ComponentSectionsCheckoutComplete {
    cart_page {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;

const CheckoutComplete = async ({
  pageID,
  index,
}: {
  pageID: number;
  index: number;
}) => {
  const locale = useServer.getState().locale;
  const paymentProvider = useServer.getState().paymentProvider;

  const { page } = await QueryContentComponent(
    locale,
    pageID,
    'page',
    ComponentSectionsCheckoutComplete,
    'sectionsCheckoutComplete'
  );
  const { cart_page } = page.data.attributes.content[index];
  if (paymentProvider === 'STRIPE')
    return (
      <StripeComplete
        cartPage={`/${locale}/${cart_page.data.attributes.slug}`}
      />
    );
  return null;
};

export default CheckoutComplete;
