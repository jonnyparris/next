import {
  UiMediaGalleryItem,
  AgnosticProductAttribute
} from '@vue-storefront/interfaces';
import { ProductVariant, ProductVariantFilters, Image } from '../types/GraphQL';
import { formatAttributeList, getVariantByAttributes } from './_utils';

export const getName = (product: ProductVariant | Readonly<ProductVariant>): string => product ? (product as any)._name : '';

export const getSlug = (product: ProductVariant | Readonly<ProductVariant>): string => product ? (product as any)._slug : '';

// todo change to getProductPrices returning different types of prices https://github.com/DivanteLtd/next/issues/128

export const getPrice = (product: ProductVariant | Readonly<ProductVariant>): number | null => product ? product.price.value.centAmount / 100 : null;

export const getGallery = (product: ProductVariant | Readonly<ProductVariant>): UiMediaGalleryItem[] =>
  (product ? product.images : [])
    .map((image: Image) => ({
      small: image.url,
      big: image.url,
      normal: image.url
    }));

export const getVariants = (products: ProductVariant[] | Readonly<ProductVariant[]>, filters: ProductVariantFilters | any = {}): ProductVariant[] | Readonly<ProductVariant[]> => {
  if (!products) {
    return [];
  }

  if (filters.attributes && Object.keys(filters.attributes).length > 0) {
    return [getVariantByAttributes(products, filters.attributes)];
  }

  if (filters.master) {
    return products.filter((product) => (product as any)._master);
  }

  return products;
};

export const getAttributes = (products: ProductVariant[] | ProductVariant, filterByAttributeName?: Array<string>): Record<string, AgnosticProductAttribute | string> => {
  const isSingleProduct = !Array.isArray(products);
  const productList = (isSingleProduct ? [products] : products) as ProductVariant[];

  if (!products || productList.length === 0) {
    return {} as any;
  }

  const formatAttributes = (product: ProductVariant): Array<AgnosticProductAttribute> =>
    formatAttributeList(product.attributeList).filter((attribute) => filterByAttributeName ? filterByAttributeName.includes(attribute.name) : attribute);

  const reduceToUniques = (prev, curr) => {
    const isAttributeExist = prev.some((el) => el.name === curr.name && el.value === curr.value);

    if (!isAttributeExist) {
      return [...prev, curr];
    }

    return prev;
  };

  const reduceByAttributeName = (prev, curr) => ({
    ...prev,
    [curr.name]: isSingleProduct ? curr.value : [
      ...(prev[curr.name] || []),
      { value: curr.value,
        label: curr.label }
    ]
  });

  return productList
    .map((product) => formatAttributes(product))
    .reduce((prev, curr) => [...prev, ...curr], [])
    .reduce(reduceToUniques, [])
    .reduce(reduceByAttributeName, {});
};

export const getDescription = (product: ProductVariant): any => (product as any)._description;

export const getCategories = (product: ProductVariant): string[] => (product as any)._categoriesRef;

export const getId = (product: ProductVariant): number => (product as any)._id;
