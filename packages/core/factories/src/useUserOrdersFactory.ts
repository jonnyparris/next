import { ref, Ref, computed } from '@vue/composition-api';
import { UseUserOrders, SearchResult, AgnosticOrderStatus, UserOrderGetters } from '@vue-storefront/interfaces';
import { wrap } from '@vue-storefront/utils';

export type UseUserOrdersFactoryParams<ORDER, ORDER_SEARCH_PARAMS> = {
  searchOrders: (params: ORDER_SEARCH_PARAMS) => Promise<SearchResult<ORDER>>;
  userOrderGetters: {
      getDate: (order: ORDER) => string;
      getNumber: (order: ORDER) => string;
      getStatus: (order: ORDER) => AgnosticOrderStatus;
      getTotal: (order: ORDER) => number | null;
  };
};

export function useUserOrdersFactory<ORDER, ORDER_SEARCH_PARAMS>(factoryParams: UseUserOrdersFactoryParams<ORDER, ORDER_SEARCH_PARAMS>) {
  return function useUserOrders(): UseUserOrders<ORDER> {
    const orders: Ref<ORDER[]> = ref([]);
    const totalOrders: Ref<number> = ref(0);
    const loading: Ref<boolean> = ref(false);

    const searchOrders = async (params?: ORDER_SEARCH_PARAMS): Promise<void> => {
      loading.value = true;
      try {
        const { data, total } = await factoryParams.searchOrders(params);
        orders.value = data;
        totalOrders.value = total;
      } finally {
        loading.value = false;
      }
    };

    const userOrderGetters: UserOrderGetters<ORDER> = {
      getDate: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getDate(wrap(order).value));
      },

      getNumber: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getNumber(wrap(order).value));
      },

      getStatus: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getStatus(wrap(order).value));
      },

      getTotal: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getTotal(wrap(order).value));
      }
    };

    return {
      searchOrders,
      userOrderGetters,
      orders: computed(() => orders.value),
      totalOrders: computed(() => totalOrders.value),
      loading: computed(() => loading.value)
    };
  };
}
