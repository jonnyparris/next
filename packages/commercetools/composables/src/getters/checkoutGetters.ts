import { ShippingMethod } from '../types/GraphQL';

export const getShippingMethodId = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.id : '';

export const getShippingMethodName = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.name : '';

export const getShippingMethodDescription = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.description : '';

export const getShippingMethodPrice = (shippingMethod: ShippingMethod): number => {
  if (!shippingMethod || !shippingMethod.zoneRates) {
    return null;
  }

  // TODO(CHECKOUT): cover the case with zones
  return shippingMethod.zoneRates[0].shippingRates[0].price.centAmount / 100;
};
