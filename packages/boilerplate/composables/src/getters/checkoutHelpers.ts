/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
type ShippingMethod = any;

// ShippingMethods
export const getShippingMethodId = (shippingMethod: ShippingMethod): string => {
  return 'shipping-method-id';
};

export const getShippingMethodName = (shippingMethod: ShippingMethod): string => {
  return 'shipping-method-name';
};

export const getShippingMethodDescription = (shippingMethod: ShippingMethod): string => {
  return 'Shipping method description';
};

export const getShippingMethodPrice = (shippingMethod: ShippingMethod): number => {
  return 10.00;
};
