import { gql, QueryContentComponent } from '@/lib/graphql';

import Cart from '@/components/sections/checkout/Cart';

import { useServer } from '@/store/serverStore';

const ComponentSectionsCart = gql`
  fragment sectionsCart on ComponentSectionsCart {
    checkout_page {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;

const CartWrapper = async ({
  pageID,
  index,
}: {
  pageID: number;
  index: number;
}) => {
  const locale = useServer.getState().locale;

  const { page } = await QueryContentComponent(
    locale,
    pageID,
    'page',
    'page',
    ComponentSectionsCart,
    'sectionsCart'
  );
  const { checkout_page } = page.data.attributes.content[index];
  return (
    <Cart checkoutPage={`/${locale}/${checkout_page.data.attributes.slug}`} />
  );
};

export default CartWrapper;
