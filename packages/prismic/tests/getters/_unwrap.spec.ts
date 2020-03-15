import { ref } from '@vue/composition-api';
import { unwrap } from '../../src/composables/getters/_utils';

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
