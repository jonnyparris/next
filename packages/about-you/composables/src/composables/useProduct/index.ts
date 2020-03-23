import { useProductFactory } from '@vue-storefront/factories';
import { mapProductSearch } from '../../helpers';
import { UseProduct, BapiProduct } from '../../types';

const useProduct: (cacheId: string) => UseProduct<BapiProduct, any> = useProductFactory<BapiProduct, any>({
  productsSearch: mapProductSearch
});

export default useProduct;
