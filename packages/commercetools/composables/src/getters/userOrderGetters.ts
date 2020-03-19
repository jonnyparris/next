import { AgnosticOrderStatus } from '@vue-storefront/interfaces';
import { Order, OrderState } from '../types/GraphQL';

export const getDate = (order: Order): string => order?.createdAt || '';

export const getNumber = (order: Order): string => order?.id || '';

const orderStatusMap = {
  [OrderState.Open]: AgnosticOrderStatus.Open,
  [OrderState.Confirmed]: AgnosticOrderStatus.Confirmed,
  [OrderState.Complete]: AgnosticOrderStatus.Complete,
  [OrderState.Cancelled]: AgnosticOrderStatus.Cancelled
};

export const getStatus = (order: Order): AgnosticOrderStatus | '' => order?.orderState ? orderStatusMap[order.orderState] : '';

export const getTotal = (order: Order): number | null => order ? order.totalPrice.centAmount / 100 : null;
