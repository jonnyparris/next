import { computed } from '@vue/composition-api';
import { ComputedProperty } from '@vue-storefront/interfaces';
import wrap from '../wrap';

interface Getters {
  [key: string]: (param: unknown, ...args: any) => ComputedProperty<any>;
}
export default function makeComputedGetters (getters: any): Getters {
  return Object.assign({}, ...Object.keys(getters).map(getterName => {
    return {
      // eslint-disable-next-line no-undef
      [getterName]: (param: unknown, ...args: any) => computed(() => getters[getterName](wrap(param).value, ...args))
    };
  }));
}
