import {
  getDate,
  getNumber,
  getStatus,
  getTotal
} from '../../src/getters/userOrderGetters';
import { OrderState, Order } from '../../src/types/GraphQL';

const order: Order = {
  createdAt: 123456789,
  id: '645ygdf',
  orderState: OrderState.Complete,
  totalPrice: {
    centAmount: 12345,
    currencyCode: 'USD'
  }
} as any;

describe('[commercetools-helpers] order helpers', () => {
  it('returns default values', () => {
    expect(getDate(null)).toBe('');
    expect(getNumber(null)).toBe('');
    expect(getStatus(null)).toBe('');
    expect(getTotal(null)).toBe(null);
  });

  it('returns date', () => {
    expect(getDate(order)).toEqual(123456789);
  });

  it('returns order number', () => {
    expect(getNumber(order)).toEqual('645ygdf');
  });

  it('returns status', () => {
    expect(getStatus(order)).toEqual(OrderState.Complete);
  });

  it('returns total gross', () => {
    expect(getTotal(order)).toEqual(123.45);
  });
});
