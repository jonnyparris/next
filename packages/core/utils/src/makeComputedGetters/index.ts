import {computed} from '@vue/composition-api';
import wrap from '../wrap';

interface Getters<T> {
  [key: string]: (param: T, ...args: any) => unknown;
}
export function makeComputedGetters<T> (getters: Getters<T>) {
  return Object.assign({}, ...Object.keys(getters).map(getterName => {
    return {
      // eslint-disable-next-line no-undef
      [getterName]: (param: T, ...args: any) => computed(() => getters[getterName](wrap(param).value, ...args))
    };
  }));
}
