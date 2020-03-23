import { computed } from '@vue/composition-api';
import wrap from '../wrap';

interface Getters {
  [key: string]: (param: any, ...args: any) => any;
}
export default function makeComputedGetters (getters: Getters) {
  return Object.assign({}, ...Object.keys(getters).map(getterName => {
    return {
      // eslint-disable-next-line no-undef
      [getterName]: (param: any, ...args: any) => computed(() => getters[getterName](wrap(param).value, ...args))
    };
  }));
}
