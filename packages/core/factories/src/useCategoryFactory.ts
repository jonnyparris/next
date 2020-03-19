import { UseCategory, CategoryGetters } from '@vue-storefront/interfaces';
import { usePersistedState } from '@vue-storefront/utils';
import { ref, Ref, computed } from '@vue/composition-api';

export type UseCategoryFactoryParams<CATEGORY, CATEGORY_SEARCH_PARAMS, PRODUCTS> = {
  categorySearch: (searchParams: CATEGORY_SEARCH_PARAMS) => Promise<CATEGORY[]>;
  categoryGetters: CategoryGetters<CATEGORY, PRODUCTS>;
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

    return {
      search,
      categoryGetters: factoryParams.categoryGetters,
      loading: computed(() => loading.value),
      categories: computed(() => categories.value)
    };
  };
}
