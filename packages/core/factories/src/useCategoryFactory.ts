import { UseCategory, UiCategory } from '@vue-storefront/interfaces';
import { usePersistedState, wrap } from '@vue-storefront/utils';
import { ref, Ref, computed } from '@vue/composition-api';

export type UseCategoryFactoryParams<CATEGORY, CATEGORY_SEARCH_PARAMS, PRODUCTS> = {
  categorySearch: (searchParams: CATEGORY_SEARCH_PARAMS) => Promise<CATEGORY[]>;
  categoryGetters: {
    getProducts: (category: CATEGORY, options: any) => PRODUCTS;
    getTree: (category: CATEGORY) => UiCategory | null;
  };
};

export function useCategoryFactory<CATEGORY, CATEGORY_SEARCH_PARAMS, PRODUCTS>(
  factoryParams: UseCategoryFactoryParams<CATEGORY, CATEGORY_SEARCH_PARAMS, PRODUCTS>
) {
  return function useCategory(cacheId?: string): UseCategory<CATEGORY, PRODUCTS> {
    const { state, persistedResource } = usePersistedState(cacheId);
    const categories: Ref<CATEGORY[]> = ref(state || []);
    const loading = ref(false);

    const search = async (params: CATEGORY_SEARCH_PARAMS) => {
      loading.value = true;
      categories.value = await persistedResource<CATEGORY[]>(
        factoryParams.categorySearch,
        params
      );
      loading.value = false;
    };

    const categoryGetters = {
      getProducts: (category: CATEGORY, options: any): Ref<Readonly<PRODUCTS>> => {
        return computed(() => factoryParams.categoryGetters.getProducts(wrap(category).value, options));
      },
      getTree: (category: CATEGORY): Ref<Readonly<UiCategory | null>> => {
        return computed(() => factoryParams.categoryGetters.getTree(wrap(category).value));
      }
    };

    return {
      search,
      categoryGetters,
      loading: computed(() => loading.value),
      categories: computed(() => categories.value)
    };
  };
}
