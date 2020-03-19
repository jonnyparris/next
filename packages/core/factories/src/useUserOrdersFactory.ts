import { ref, Ref, computed } from '@vue/composition-api';
import { UseUserOrders, SearchResult, AgnosticOrderStatus, UserOrderGetters } from '@vue-storefront/interfaces';
import { wrap } from '@vue-storefront/utils';

export type UseUserOrdersFactoryParams<ORDER, ORDER_SEARCH_PARAMS> = {
  searchOrders: (params: ORDER_SEARCH_PARAMS) => Promise<SearchResult<ORDER>>;
  userOrderGetters: {
      getOrderDate: (order: ORDER) => string;
      getOrderNumber: (order: ORDER) => string;
      getOrderStatus: (order: ORDER) => AgnosticOrderStatus;
      getOrderTotal: (order: ORDER) => number | null;
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
      getOrderDate: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getOrderDate(wrap(order).value));
      },

      getOrderNumber: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getOrderNumber(wrap(order).value));
      },

      getOrderStatus: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getOrderStatus(wrap(order).value));
      },

      getOrderTotal: (order: ORDER) => {
        return computed(() => factoryParams.userOrderGetters.getOrderTotal(wrap(order).value));
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
