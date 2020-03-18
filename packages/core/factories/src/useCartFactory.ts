import { UseCart, AgnosticTotals, AgnosticProductAttribute } from '@vue-storefront/interfaces';
import { Ref, ref, computed } from '@vue/composition-api';
import { wrap } from '@vue-storefront/utils';

export type UseCartFactoryParams<CART, CART_ITEM, PRODUCT, COUPON> = {
  cart: Ref<CART>;
  loadCart: () => Promise<CART>;
  addToCart: (params: {
    currentCart: CART;
    product: PRODUCT;
    quantity: any;
  }) => Promise<CART>;
  removeFromCart: (params: {
    currentCart: CART;
    product: CART_ITEM;
  }) => Promise<CART>;
  updateQuantity: (params: {
    currentCart: CART;
    product: CART_ITEM;
    quantity: number;
  }) => Promise<CART>;
  clearCart: (prams: { currentCart: CART }) => Promise<CART>;
  applyCoupon: (params: {
    currentCart: CART;
    coupon: string;
  }) => Promise<{ updatedCart: CART; updatedCoupon: COUPON }>;
  removeCoupon: (params: {
    currentCart: CART;
  }) => Promise<{ updatedCart: CART; updatedCoupon: COUPON }>;
  isOnCart: (params: { currentCart: CART; product: PRODUCT }) => boolean;
  cartHelpers: {
    getProducts: (cart: CART) => PRODUCT[];
    getProductName: (product: PRODUCT) => string;
    getProductImage: (product: PRODUCT) => string;
    getProductPrice: (product: PRODUCT) => string;
    getProductQty: (product: PRODUCT) => string;
    getProductAttributes:
      (product: PRODUCT, filterByAttributeName?: Array<string>) => Record<string, string | AgnosticProductAttribute>;
    getProductSku: (product: PRODUCT) => string;
    getTotals: (cart: CART) => AgnosticTotals;
    getShippingPrice: (cart: CART) => number;
    getTotalItems: (cart: CART) => number;
  };
};

export function useCartFactory<CART, CART_ITEM, PRODUCT, COUPON>(
  factoryParams: UseCartFactoryParams<CART, CART_ITEM, PRODUCT, COUPON>
) {
  const appliedCoupon: Ref<COUPON | null> = ref(null);
  const loading: Ref<boolean> = ref<boolean>(false);

  return function useCart(): UseCart<CART, CART_ITEM, PRODUCT, COUPON> {

    const cartGetters = {
      getProducts: (cart: CART) => {
        return computed(() => factoryParams.cartHelpers.getProducts(wrap(cart).value));
      },
      getProductName: (product: PRODUCT) => {
        return computed(() => factoryParams.cartHelpers.getProductName(wrap(product).value));
      },
      getProductImage: (product: PRODUCT) => {
        return computed(() => factoryParams.cartHelpers.getProductImage(wrap(product).value));
      },
      getProductPrice: (product: PRODUCT) => {
        return computed(() => factoryParams.cartHelpers.getProductPrice(wrap(product).value));
      },
      getProductQty: (product: PRODUCT) => {
        return computed(() => factoryParams.cartHelpers.getProductQty(wrap(product).value));
      },
      getProductAttributes: (product: PRODUCT, filterByAttributeName?: Array<string>) => {
        return computed(() => factoryParams.cartHelpers.getProductAttributes(wrap(product).value, filterByAttributeName));
      },
      getProductSku: (product: PRODUCT) => {
        return computed(() => factoryParams.cartHelpers.getProductSku(wrap(product).value));
      },
      getTotals: (cart: CART) => {
        return computed(() => factoryParams.cartHelpers.getTotals(wrap(cart).value));
      },
      getShippingPrice: (cart: CART) => {
        return computed(() => factoryParams.cartHelpers.getShippingPrice(wrap(cart).value));
      },
      getTotalItems: (cart: CART) => {
        return computed(() => factoryParams.cartHelpers.getTotalItems(wrap(cart).value));
      }
    };

    const addToCart = async (product: PRODUCT, quantity: number) => {
      loading.value = true;
      const updatedCart = await factoryParams.addToCart({
        currentCart: factoryParams.cart.value,
        product,
        quantity
      });
      factoryParams.cart.value = updatedCart;
      loading.value = false;
    };

    const removeFromCart = async (product: CART_ITEM) => {
      loading.value = true;
      const updatedCart = await factoryParams.removeFromCart({
        currentCart: factoryParams.cart.value,
        product
      });
      factoryParams.cart.value = updatedCart;
      loading.value = false;
    };

    const updateQuantity = async (product: CART_ITEM, quantity?: number) => {
      if (quantity && quantity > 0) {
        loading.value = true;
        const updatedCart = await factoryParams.updateQuantity({
          currentCart: factoryParams.cart.value,
          product,
          quantity
        });
        factoryParams.cart.value = updatedCart;
        loading.value = false;
      }
    };

    const refreshCart = async () => {
      factoryParams.cart.value = await factoryParams.loadCart();
    };

    const clearCart = async () => {
      loading.value = true;
      const updatedCart = await factoryParams.clearCart({
        currentCart: factoryParams.cart.value
      });
      factoryParams.cart.value = updatedCart;
      loading.value = false;
    };

    const isOnCart = (product: PRODUCT) => {
      return factoryParams.isOnCart({
        currentCart: factoryParams.cart.value,
        product
      });
    };

    const applyCoupon = async (coupon: string) => {
      loading.value = true;
      const { updatedCart, updatedCoupon } = await factoryParams.applyCoupon({
        currentCart: factoryParams.cart.value,
        coupon
      });
      factoryParams.cart.value = updatedCart;
      appliedCoupon.value = updatedCoupon;
      loading.value = false;
    };

    const removeCoupon = async () => {
      loading.value = true;
      const { updatedCart, updatedCoupon } = await factoryParams.removeCoupon({
        currentCart: factoryParams.cart.value
      });
      factoryParams.cart.value = updatedCart;
      appliedCoupon.value = updatedCoupon;
      loading.value = false;
    };

    if (!factoryParams.cart.value) refreshCart();

    return {
      cart: computed(() => factoryParams.cart.value),
      cartGetters,
      isOnCart,
      addToCart,
      refreshCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      coupon: computed(() => appliedCoupon.value),
      applyCoupon,
      removeCoupon,
      loading: computed(() => loading.value)
    };
  };
}
