/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ProductVariant, Category } from '@vue-storefront/boilerplate-api/src/types';

// Category
// TODO:  What is options?
export const getProducts = (category: Category, options: any = {}): ProductVariant[] => {
  return [{}, {}, {}, {}, {}];
};

export const getName = (category: Category) => {
  return category.name || '';
};
