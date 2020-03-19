import {
  UiCategory
} from '@vue-storefront/interfaces';
import { ProductVariant, Category } from '../types/GraphQL';

export const getProducts = (category: Category, options: any = {}): ProductVariant[] => {
  if (!category || !(category as any)._products) {
    return [];
  }

  const { _products } = category as any;

  if (options.master) {
    return _products.filter((v) => (v as any)._master);
  }

  return _products;
};

export const getTree = (category: Category): UiCategory | null => {
  const getRoot = (category: Category): Category => (category.parent ? getRoot(category.parent) : category);
  const buildTree = (rootCategory: Category) => ({
    label: rootCategory.name,
    slug: rootCategory.slug,
    items: rootCategory.children.map(buildTree)
  });

  if (!category) {
    return null;
  }

  return buildTree(getRoot(category));
};
