# Filtering products

Filtering products is an important part of any products listing page. To ensure the best developer experience and consistency between integrations (because filters have to be delivered to the theme in a unified form) we need to provide a common way to retrieve available filters and unified interface.

## New APIs

### Separate composable

Since there are several factors that the filters depend on (products type, category, available products, their attributes) and the set of filters might be dynamic, but also should be configurable by the user (exclude/include attributes, define values/ranges), this feature should introduce new composable that will deliver filters ready to use by both theme and `useProduct` composable through its search function.

**Composable interface**:

```typescript
interface UseFilters<PRODUCT, FILTER_BASE> {
  filters: Filter<FILTER_BASE>[];
  // this will allow us to set desired filters and under the hood prepare some data for them, like count for each option etc.
  prepareFilters: <PRODUCT>(filters: Filter<FILTER_BASE>[]) => Promise<void>;
  loading: boolean;
}
```

**Composable implementation**:

(this will be implemented on core factory level of course, composable given just to simplify the example)

```typescript
async function getAvailableFilters(): Promise<Filter<SomeFilterBaseEnum>[]> {
  // To determine what are available filters and let `prepareFilters`
  // only set a subset of them
  ...
}

function useFilters(): UseFilters<PRODUCT, FILTER_BASE> {
  const filters: Filter<FILTER_BASE>[] = ref([]);

  async function prepareFilters<FILTER_BASE>(filters: Filter<FILTER_BASE>[]) {
    // here load available filters,
    // intersect them with given desired ones
    // set count and/or possible values for specific filters etc.
    filters.value = result;
  }

  return {
    filters: computed(() => filters.value),
    prepareFilters,
    loading
  }
}
```

### Filter interface

We need a unified interface for filters, like:

```typescript
// FILTER_BASE is an enum with available filter bases, like price, attribute, status, quantity, availability, sale percentage etc.
// this will be handled per integration, but basic agnostic bases are added
interface Filter<FILTER_BASE> {
  name: string;
  type: FilterType;
  filterBase: AgnosticFilterBase | FILTER_BASE;
  options: FilterOption[]
}

enum FilterType {
  RANGE = 'range', // eg. price
  SINGLE = 'single', // eg. availability status
  MULTI = 'multi', // eg. predefined price ranges or sizes
  ...
}

interface FilterOption {
  label: string;
  value: string | number | [number, number]; // tuple for multiple min-max ranges
  count?: number;
}

enum AgnosticFilterBase {
  PRICE = 'price',
  ATTRIBUTE = 'attribute',
  ...
}
```

The filter interface will be set as type for `search` function param:

```typescript
search: (params: {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: Filter<FILTER_BASE>[];
  [x: string]: any;
}) => Promise<void>;
```

### Changes in `useProductFactory`

New generic has to be added:

```typescript
interface SearchParams<FILTER_BASE> = {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: Filter<FILTER_BASE>[];
}

export type UseProductFactoryParams<PRODUCT, PRODUCT_SEARCH_PARAMS extends SearchParams<FILTER_BASE>, FILTER_BASE> = {
  productsSearch: (searchParams: PRODUCT_SEARCH_PARAMS) => Promise<SearchResult<PRODUCT>>;
};

export function useProductFactory<PRODUCT, PRODUCT_SEARCH_PARAMS, FILTER_BASE>(
  factoryParams: UseProductFactoryParams<PRODUCT, PRODUCT_SEARCH_PARAMS, FILTER_BASE>
) {
  return function useProduct(cacheId: string): UseProduct<PRODUCT, FILTER_BASE> {
    ...
```

## Migration process

- Add new composable.
- Add enum providing additional filtering bases.
