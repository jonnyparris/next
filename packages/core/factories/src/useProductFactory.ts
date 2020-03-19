import { UseProduct, ProductGetters, SearchResult } from '@vue-storefront/interfaces';
import { ref, Ref, computed } from '@vue/composition-api';

type SearchParams = {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: any;
}

export type UseProductFactoryParams<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS extends SearchParams> = {
  productsSearch: (searchParams: PRODUCT_SEARCH_PARAMS) => Promise<SearchResult<PRODUCT>>;
  productGetters: ProductGetters<PRODUCT, PRODUCT_FILTERS>;
};

export function useProductFactory<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS>(
  factoryParams: UseProductFactoryParams<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS>
) {
  return function useProduct(cacheId: string): UseProduct<PRODUCT, PRODUCT_FILTERS> {
    console.info(
      'SSR Temporarly disbled for product composable https://github.com/DivanteLtd/next/issues/232',
      cacheId
    );
    // const { state, persistedResource } = usePersistedState(id);

    // const products: Ref<ProductVariant[]> = ref(state || []);\
    const products: Ref<PRODUCT[]> = ref([]);
    const totalProducts: Ref<number> = ref(0);
    const loading = ref(false);

    const search = async (params: PRODUCT_SEARCH_PARAMS) => {
      loading.value = true;
      // products.value = await persistedResource<ProductVariant[]>(loadProductVariants, params);
      const { data, total } = await factoryParams.productsSearch(params);
      products.value = data;
      totalProducts.value = total;
      loading.value = false;
    };

    return {
      search,
      productGetters: factoryParams.productGetters,
      products: computed(() => products.value),
      loading: computed(() => loading.value),
      totalProducts: computed(() => totalProducts.value)
    };
  };
}
