import { ref, Ref } from '@vue/composition-api';
import { UseCart } from '@vue-storefront/interfaces';
import { makeComputedGetters } from '@vue-storefront/utils';
import {
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity
} from '@vue-storefront/commercetools-api';
import { useCartFactory, UseCartFactoryParams} from '@vue-storefront/factories';
import loadCurrentCart from './currentCart';
import { cartGetters } from './../getters';
import { ProductVariant, Cart, LineItem } from './../types/GraphQL';

export const cart: Ref<Cart> = ref(null);

const params: UseCartFactoryParams<Cart, LineItem, ProductVariant, any> = {
  cart,
  loadCart: async () => {
    return await loadCurrentCart();
  },
  addToCart: async ({ currentCart, product, quantity }) => {
    const updatedCart = await apiAddToCart(currentCart, product, quantity);
    return updatedCart.data.cart;
  },
  removeFromCart: async ({ currentCart, product }) => {
    const updateResponse = await apiRemoveFromCart(currentCart, product);
    return updateResponse.data.cart;
  },
  updateQuantity: async ({ currentCart, product, quantity }) => {
    const updatedCart = await apiUpdateCartQuantity(
      currentCart, { ...product, quantity }
    );
    return updatedCart.data.cart;
  },
  clearCart: async ({ currentCart }) => {
    return currentCart;
  },
  applyCoupon: async ({ currentCart, coupon }) => {
    return { updatedCart: currentCart, updatedCoupon: coupon };
  },
  removeCoupon: async ({ currentCart }) => {
    return { updatedCart: currentCart, updatedCoupon: null };
  },
  isOnCart: ({ currentCart }) => {
    console.log('Mocked isOnCart', currentCart);
    return true;
  },
  cartGetters: makeComputedGetters(cartGetters)
};

const useCart: () => UseCart<Cart, LineItem, ProductVariant, any> = useCartFactory<Cart, LineItem, ProductVariant, any>(params);

export default useCart;
