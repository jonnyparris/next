/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import {
  UiMediaGalleryItem,
  AgnosticProductAttribute
} from '@vue-storefront/interfaces';
import { ProductVariant } from '@vue-storefront/boilerplate-api/src/types';

type ProductVariantFilters = any

// TODO: Add interfaces for some of the methods in core
export const getName = (product: ProductVariant): string => {
  return 'ProductName';
};

export const getProductSlug = (product: ProductVariant): string => {
  return 'product-slug';
};

// todo change to getProductPrices returning different types of prices https://github.com/DivanteLtd/next/issues/128
export const getPrice = (product: ProductVariant): number | null => {
  return 22.99;
};

export const getGallery = (product: ProductVariant): UiMediaGalleryItem[] => {
  return [{
    small: '',
    big: '',
    normal: ''
  }];
};

export const getVariants = (products: ProductVariant[], filters: ProductVariantFilters = {}): ProductVariant | ProductVariant[] => {
  return [{}, {}, {}];
};

// done: unified filters param from filterByAttributes
export const getAttributes = (products: ProductVariant[], filters?: Array<string>): AgnosticProductAttribute[] => {
  return [{
    name: 'color',
    value: 'red',
    label: 'red'
  }, {
    name: 'size',
    value: 'S',
    label: 'S'
  }];
};

export const getDescription = (product: ProductVariant): string => {
  return 'Lorem ipsum dolor sit amet';
};
