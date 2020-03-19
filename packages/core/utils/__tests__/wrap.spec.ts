import wrap from '../src/wrap';
import { ref } from '@vue/composition-api';

describe('[CORE utils] unwrap', () => {
  it('should return ref when passed ref', () => {
    const element = ref('test-value');
    const unwrappedValue = wrap(element);
    expect(unwrappedValue.value).toBe('test-value');
  });
  it('should return ref when passed value', () => {
    const element = 'test-value';
    const unwrappedValue = wrap(element);
    expect(unwrappedValue.value).toBe('test-value');
  });
});
