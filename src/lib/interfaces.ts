import { graphQLProductProps } from '@/lib/graphql';

export interface CartItem {
  product: graphQLProductProps;
  qty: number;
}
