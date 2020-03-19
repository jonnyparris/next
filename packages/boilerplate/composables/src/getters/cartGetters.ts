/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { Cart } from '@vue-storefront/boilerplate-api/src/types';

// TODO: Change UICartProduct to something agnostic.
export const getProducts = (cart: Cart, includeAttributes: string[] = []): any[] => {
  return [{}, {}, {}, {}, {}];
};

// todo: remove CartPrice and unify with getProductPrice
export const getTotals = (cart: Cart) => {
  return {
    total: 300.00,
    subtotal: 240.00
  };
};

export const getShippingPrice = (cart: Cart): number => {
  return 100.00;
};

export const getTotalItems = (cart: Cart): number => {
  return 3;
};
