import { gql, QueryContentComponent } from '@/lib/graphql';

import StripeTunnel from '@/components/sections/checkout/stripe/StripeTunnel';

import { useServer } from '@/store/serverStore';

const ComponentSectionsCheckoutTunnel = gql`
  fragment sectionsCheckoutTunnel on ComponentSectionsCheckoutTunnel {
    cart_page {
      data {
        attributes {
          slug
        }
      }
    }
    complete_page {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;

const CheckoutTunnel = async ({
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
    'page',
    ComponentSectionsCheckoutTunnel,
    'sectionsCheckoutTunnel'
  );
  const { cart_page, complete_page } = page.data.attributes.content[index];
  if (paymentProvider === 'STRIPE')
    return (
      <StripeTunnel
        cartPage={`/${locale}/${cart_page.data.attributes.slug}`}
        completePage={`/${locale}/${complete_page.data.attributes.slug}`}
      />
    );
  return null;
};

export default CheckoutTunnel;
