/* istanbul ignore file */

import { UseCheckout } from '@vue-storefront/interfaces';
import { wrap } from '@vue-storefront/utils';
import { placeOrder as processOrder, getShippingMethods } from '@vue-storefront/commercetools-api';
import { ref, Ref, watch, computed } from '@vue/composition-api';
import { checkoutGetters as checkoutPlainGetters } from '../getters';
import { cart } from './../useCart';
import { ShippingMethod, AddressInput, Customer } from '@vue-storefront/commercetools-api/lib/src/types/GraphQL';

const PAYMENT_METHODS_MOCK = [
  {
    label: 'Visa Debit',
    value: 'debit'
  },
  {
    label: 'MasterCard',
    value: 'mastercard'
  },
  {
    label: 'Visa Electron',
    value: 'electron'
  },
  {
    label: 'Cash on delivery',
    value: 'cash'
  },
  {
    label: 'Check',
    value: 'check'
  }
];
export const paymentMethods: Ref<any[]> = ref(PAYMENT_METHODS_MOCK);
export const shippingMethods: Ref<any[]> = ref([]);
export const personalDetails: Ref<Customer> = ref({});
export const shippingDetails: Ref<AddressInput> = ref({});
export const billingDetails: Ref<AddressInput> = ref({});
export const chosenPaymentMethod: Ref<string> = ref('');
export const chosenShippingMethod: Ref<ShippingMethod> = ref({});

// TODO(CHECKOUT): selecting payment method
export default function useCheckout(): UseCheckout<any, any, any, any, any, any, any, any> {
  watch(async () => {
    if (shippingMethods.value.length === 0) {
      // TODO(CHECKOUT): Update shipping data for each update form
      const shippingMethodsResponse = await getShippingMethods();
      shippingMethods.value = shippingMethodsResponse.data.shippingMethods.results as any;
    }
  });

  const checkoutGetters = {
    getShippingMethodId: (user: Ref<ShippingMethod> | ShippingMethod) => {
      return computed(() => checkoutPlainGetters.getShippingMethodId(wrap(user).value));
    },
    getShippingMethodName: (user: Ref<ShippingMethod> | ShippingMethod) => {
      return computed(() => checkoutPlainGetters.getShippingMethodName(wrap(user).value));
    },
    getShippingMethodDescription: (user: Ref<ShippingMethod> | ShippingMethod) => {
      return computed(() => checkoutPlainGetters.getShippingMethodDescription(wrap(user).value));
    },

    getShippingMethodPrice: (user: Ref<ShippingMethod> | ShippingMethod) => {
      return computed(() => checkoutPlainGetters.getShippingMethodPrice(wrap(user).value));
    }
  };

  const placeOrder = async () => {
    const orderData = {
      shippingDetails: shippingDetails.value,
      billingDetails: billingDetails.value,
      shippingMethod: chosenShippingMethod.value.id
    };

    await processOrder(cart.value, orderData);
  };

  const loading = ref(true);

  return {
    paymentMethods,
    checkoutGetters,
    shippingMethods,
    personalDetails,
    shippingDetails,
    billingDetails,
    chosenPaymentMethod,
    chosenShippingMethod,
    placeOrder,
    loading: computed(() => loading.value)
  };
}
