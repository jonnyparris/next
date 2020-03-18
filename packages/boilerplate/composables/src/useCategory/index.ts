/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { UseCategory } from '@vue-storefront/interfaces';
import { ref, Ref, computed } from '@vue/composition-api';
import { Category, CategoryFilter } from '@vue-storefront/boilerplate-api/src/types';
import { categoryHelpers, wrap } from './../getters';

// Category-specific typings.
// Those inetrfaces are just recommendations.
// Feel free to update them to match your platform specification.
type Search = (params: any) => void
type AppliedFilters = Ref<CategoryFilter[]>
type ApplyFilter = (filter: CategoryFilter | CategoryFilter[]) => void
type ClearFilters = () => void

export default function useCategory(): UseCategory<Category, Search, AppliedFilters, ApplyFilter, ClearFilters, LineItems> {
  const categories: Ref<Category[]> = ref([]);
  const loading: Ref<boolean> = ref(true);
  const error: Ref<any> = ref(null);
  const appliedFilters: AppliedFilters = ref(null);
  const applyFilter: ApplyFilter = (filter) => {};
  const clearFilters: ClearFilters = () => {};

  const categoryGetters = {
    getProducts: (category: Category, options: any) => {
      return computed(() => categoryHelpers.getProducts(wrap(category, options).value));
    },
    getTree: (category: Category) => {
      return computed(() => categoryHelpers.getTree(wrap(category).value));
    }
  };

  const search: Search = async (params) => {
    // load category based on Search Params
    loading.value = false;
  };

  return {
    categories,
    search,
    appliedFilters,
    applyFilter,
    clearFilters,
    categoryGetters,
    loading,
    error
  };
}
