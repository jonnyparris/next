import { UseCategory } from '@vue-storefront/interfaces';
import { getCategory } from '@vue-storefront/commercetools-api';
import { Category, ProductVariant } from './../types/GraphQL';
import { useCategoryFactory, UseCategoryFactoryParams } from '@vue-storefront/factories';
import { categoryGetters } from '../getters';

const params: UseCategoryFactoryParams<Category, any> = {
  categorySearch: async (params) => {
    const categoryResponse = await getCategory(params);
    return categoryResponse.data.categories.results;
  },
  categoryGetters
};

const useCategory: (id: string) => UseCategory<Category, ProductVariant[]> = useCategoryFactory<Category, any>(params);

export default useCategory;
