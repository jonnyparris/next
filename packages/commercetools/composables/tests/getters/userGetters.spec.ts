import {
  getFirstName,
  getLastName,
  getFullName
} from '../../src/getters/userGetters';

const user = {
  firstName: 'John',
  lastName: 'Doe'
} as any;

describe('[commercetools getters] user Getters', () => {
  it('returns default values', () => {
    expect(getFirstName(null)).toBe('');
    expect(getLastName(null)).toBe('');
    expect(getFullName(null)).toBe('');
  });

  it('returns first name', () => {
    expect(getFirstName(user)).toBe('John');
  });

  it('returns last name', () => {
    expect(getLastName(user)).toBe('Doe');
  });

  it('returns full name', () => {
    expect(getFullName(user)).toBe('John Doe');
  });
});
