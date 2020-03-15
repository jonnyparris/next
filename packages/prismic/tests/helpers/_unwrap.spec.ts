import { unwrap } from '../../src/getters/_utils';
import { ref } from '@vue/composition-api';

describe('[commercetools getters] unwrap', () => {
  it('should return ref when passed ref', () => {
    const element = ref('test-value');
    const unwrappedValue = unwrap(element);
    expect(unwrappedValue.value).toBe('test-value');
  });
  it('should return ref when passed value', () => {
    const element = 'test-value';
    const unwrappedValue = unwrap(element);
    expect(unwrappedValue.value).toBe('test-value');
  });
});
