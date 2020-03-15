import { Customer } from '../types/GraphQL';

export const getFirstName = (user: Customer): string => user ? user.firstName : '';

export const getLastName = (user: Customer): string => user ? user.lastName : '';

export const getFullName = (user: Customer): string => user ? `${user.firstName} ${user.lastName}` : '';
