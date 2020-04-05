# Filtering products

Filtering products is an important part of any products listing page. To ensure the best developer experience and consistency between integrations (because filters have to be delivered to the theme in a unified form) we need to provide a common way to retrieve available filters and unified interface for them.

## New APIs

### Modify `useProduct` composable

Since there are several factors that the filters depend on (products type, category, available products, their attributes) and the set of filters might be dynamic, but also should be configurable by the user (exclude/include attributes, define values/ranges), this feature should introduce new fields and functions in the `useProduct` composable.

**New interface**:

```typescript
export interface UseProduct<PRODUCT, FILTER_BASE> {
  products: ComputedProperty<PRODUCT[]>;
  totalProducts: ComputedProperty<number>;
  filters: ComputedProperty<Filter<FILTER_BASE>[]>;
  search: (params: {
    perPage?: number;
    page?: number;
    sort?: any;
    term?: any;
    filters?: Filter<FILTER_BASE>[];
    [x: string]: any;
  }) => Promise<void>;
  setFilters: (filters: Filter<FILTER_BASE>[]) => Promise<void>;
  loading: ComputedProperty<boolean>;
  [x: string]: any;
}
```

**New `UseProductFactoryParams` interface**

Loading filters, their possible values, counts, etc. will require an integration-specific function that will deliver that data.
It will receive search params to be able to fetch filters accordingly eg. to the category.

```typescript
export type UseProductFactoryParams<PRODUCT, PRODUCT_SEARCH_PARAMS extends SearchParams, FILTER_BASE> = {
  productsSearch: (searchParams: PRODUCT_SEARCH_PARAMS) => Promise<SearchResult<PRODUCT>>;
  // To determine what are available filters and let `setFilters` only set a subset of them
  getAvailableFilters: (searchParams: PRODUCT_SEARCH_PARAMS) => Promise<Filter<FILTER_BASE>[]>
};
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

## Migration process

- Add new param function (`getAvailableFilters`) to `useProduct` params for the factory.
- Add enum providing additional specific filtering bases not covered by `AgnosticFilterBase`.
