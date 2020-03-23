import { getProduct } from '@vue-storefront/commercetools-api';
import { useProductFactory } from '@vue-storefront/factories';
import { enhanceProduct } from './../helpers/internals';
import { ProductVariant } from './../types/GraphQL';
import { ProductSearch } from '@vue-storefront/commercetools-api/lib/src/types/Api';
import { SearchResult } from '@vue-storefront/interfaces';
import { makeComputedGetters } from '@vue-storefront/utils';
import { productGetters } from '../getters';

const productsSearch = async (params: ProductSearch): Promise<SearchResult<ProductVariant>> => {
  const productResponse = await getProduct(params);
  const enhancedProductResponse = enhanceProduct(productResponse);
  return {
    data: (enhancedProductResponse.data as any)._variants,
    total: productResponse.data.products.total
  };
};

export default useProductFactory<ProductVariant, ProductSearch>({
  productsSearch,
  productGetters: makeComputedGetters(productGetters)
});
