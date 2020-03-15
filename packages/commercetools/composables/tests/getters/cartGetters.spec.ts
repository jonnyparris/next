import { getAttributes } from '../../src/getters/productHelpers';
import {
  getProducts,
  getTotals,
  getShippingPrice,
  getTotalItems,
  getProductName,
  getProductPrice,
  getProductImage,
  getProductSku,
  getProductAttributes
} from '../../src/getters/cartHelpers';

const price = (p) => ({ value: { centAmount: p } });
const variant = (p = {}) => ({
  ...p,
  images: [{ url: 'a.jpg' }, { url: 'b.jpg' }]
});

const cart = {
  lineItems: [
    { name: 'prod1',
      id: 1,
      price: price(1100),
      variant: variant(),
      quantity: 1
    },
    { name: 'prod2',
      id: 2,
      price: price(1500),
      variant: variant(),
      quantity: 2
    }
  ],
  totalPrice: {
    centAmount: 12444
  },
  shippingInfo: {
    price: {
      centAmount: 444
    }
  }
} as any;

describe('[commercetools getters] cart helpers', () => {
  it('returns default values', () => {
    expect(getProducts(null)).toEqual([]);
  });

  it('returns products', () => {
    expect(getProducts(cart)).toEqual(cart.lineItems);
  });

  it('returns cart total price', () => {
    expect(getTotals(null)).toEqual({
      total: 0,
      subtotal: 0
    });
    expect(getTotals(cart).total).toEqual(128.88);
    expect(getTotals({
      ...cart,
      shippingInfo: null
    }).total).toEqual(124.44);
  });

  it('returns cart subtotal price', () => {
    expect(getTotals(cart).subtotal).toEqual(124.44);
    expect(getTotals({
      ...cart,
      shippingInfo: null
    }).subtotal).toEqual(124.44);
  });

  it('returns cart shipping price', () => {
    expect(getShippingPrice(cart)).toEqual(4.44);
    expect(getShippingPrice({ ...cart,
      shippingInfo: null })).toEqual(0);
  });

  it('returns cart total items', () => {
    expect(getTotalItems(null)).toEqual(0);
    expect(getTotalItems(cart)).toEqual(3);
  });

  it('returns cart product name', () => {
    expect(getProductName({ name: 'test' } as any)).toEqual('test');
  });

  it('returns cart product image', () => {
    expect(
      getProductImage({ variant: { images: [{ url: 'image.jpg' }]}} as any)
    ).toEqual('image.jpg');
  });

  it('returns cart product price', () => {
    expect(getProductPrice({ price: { value: { centAmount: 111 }}} as any)).toEqual(1.11);
  });

  it('returns cart product attributes', () => {
    const args = {
      variant: 'test variant',
      filters: ['filter']
    };
    (getAttributes as any) = jest.fn()
      .mockImplementation((variant, filters) => ({
        variant,
        filters
      }));

    expect(
      getProductAttributes({ variant: 'test variant' } as any, ['filter'])
    ).toEqual(args);
  });

  it('returns cart product sku', () => {
    expect(getProductSku({ variant: { sku: 'XXX1' }} as any)).toEqual('XXX1');
  });
});
