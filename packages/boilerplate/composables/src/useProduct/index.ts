import { UseProduct } from '@vue-storefront/interfaces';
import { ref, Ref } from '@vue/composition-api';
import { ProductVariant } from '@vue-storefront/boilerplate-api/src/types';

// Product-specific typings.
// Those inetrfaces are just recommendations.
// Feel free to update them to match your platform specification.

export default function useProduct(): UseProduct<ProductVariant, any> {
  const products: Ref<ProductVariant[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string> = ref(null);
  const productGetters = {} as any;
  const totalProducts = ref(0);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const search = async (params) => {};

  return {
    totalProducts,
    products,
    productGetters,
    search,
    loading,
    error
  };
}
