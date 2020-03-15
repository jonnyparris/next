import { productHelpers } from './index';
import { AgnosticTotals } from '@vue-storefront/interfaces';
import { Cart, LineItem } from '../types/GraphQL';

export const getProducts = (cart: Cart): LineItem[] => {
  if (!cart) {
    return [];
  }

  return cart.lineItems;
};

export const getProductName = (product: LineItem): string => product.name;

export const getProductImage = (product: LineItem): string => product.variant.images[0].url;

export const getProductPrice = (product: LineItem): number => product.price.value.centAmount / 100;

export const getProductQty = (product: LineItem): number => product.quantity;

export const getProductAttributes = (product: LineItem, filterByAttributeName?: Array<string>) =>
  productHelpers.getAttributes(product.variant, filterByAttributeName);

export const getProductSku = (product: LineItem): string => product.variant.sku;

export const getTotals = (cart: Cart): AgnosticTotals => {
  if (!cart) {
    return {
      total: 0,
      subtotal: 0
    };
  }

  const subtotalPrice = cart.totalPrice.centAmount;
  const shipping = cart.shippingInfo ? cart.shippingInfo.price.centAmount : 0;

  return {
    total: (shipping + subtotalPrice) / 100,
    subtotal: subtotalPrice / 100
  };
};

export const getShippingPrice = (cart: Cart): number => cart && cart.shippingInfo ? cart.shippingInfo.price.centAmount / 100 : 0;

export const getTotalItems = (cart: Cart): number => {
  if (!cart) {
    return 0;
  }

  return cart.lineItems.reduce((previous, current) => previous + current.quantity, 0);
};
