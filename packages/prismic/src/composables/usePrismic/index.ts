import { ref, Ref, computed } from '@vue/composition-api';
import { wrap } from '@vue-storefront/utils';
import { PrismicQuery, PrismicMeta, PrismicOptions } from '../../types';
import { Document } from 'prismic-javascript/d.ts/documents';
import loadDocuments from './loadDocuments';
import { prismicHelpers } from '../getters';

type Search = (query: PrismicQuery | PrismicQuery[], options?: PrismicOptions) => Promise<void>;

interface PrismicGetters {
    getPages: (doc: Document | Document[], pageUid?: string) => Ref<Readonly<Document | null | Document[]>>;
    getCurrentPage: (doc: PrismicMeta | null) => Ref<Readonly<number>>;
    getResultsPerPage: (doc: PrismicMeta | null) => Ref<Readonly<number>>;
    getResultsSize: (doc: PrismicMeta | null) => Ref<Readonly<number>>;
    getTotalResultsSize: (doc: PrismicMeta | null) => Ref<Readonly<number>>;
    getTotalPages: (doc: PrismicMeta | null) => Ref<Readonly<number>>;
    getNextPage: (doc: PrismicMeta | null) => Ref<Readonly<string | null>>;
    getPrevPage: (doc: PrismicMeta | null) => Ref<Readonly<string | null>>;
    getPageUid: (page: Document) => Ref<Readonly<string>>;
    getPageId: (page: Document) => Ref<Readonly<string>>;
    getPageType: (page: Document) => Ref<Readonly<string>>;
    getPageHref: (page: Document) => Ref<Readonly<string>>;
    getPageTags: (page: Document) => Ref<Readonly<string[]>>;
    getPageSlugs: (page: Document) => Ref<Readonly<string[]>>;
    getPageLang: (page: Document) => Ref<Readonly<string>>;
    getBlocks: (data: any, blockName?: any, transform?: any) => Ref<Readonly<string | string[]>>;
    getSlices: ({ data }: Document, sliceType?: any) => Ref<Readonly<any>>;
}

interface UsePrismic {
  loading: Ref<boolean>;
  error: Ref<boolean>;
  doc: Ref<Document | Document[]>;
  meta: Ref<PrismicMeta | null>;
  search: Search;
  prismicGetters: PrismicGetters;
}

export default function usePrismic(): UsePrismic {
  const loading = ref(false);
  const error = ref(null);
  const doc: Ref<Document | Document[]> = ref({});
  const meta: Ref<PrismicMeta | null> = ref(null);

  const search: Search = async (query: PrismicQuery | PrismicQuery[], options: PrismicOptions = {}) => {
    loading.value = true;

    const { results, metadata } = await loadDocuments(query, options);

    meta.value = metadata;
    doc.value = results;
    loading.value = false;
  };

  const prismicGetters = {
    getPages: (doc: Document | Document[], pageUid?: string): Ref<Readonly<Document | null | Document[] >> => {
      return computed(() => prismicHelpers.getPages(wrap(doc).value, pageUid));
    },

    getCurrentPage: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicHelpers.getCurrentPage(wrap(doc).value));
    },

    getResultsPerPage: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicHelpers.getResultsPerPage(wrap(doc).value));
    },

    getResultsSize: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicHelpers.getResultsSize(wrap(doc).value));
    },

    getTotalResultsSize: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicHelpers.getTotalResultsSize(wrap(doc).value));
    },

    getTotalPages: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicHelpers.getTotalPages(wrap(doc).value));
    },

    getNextPage: (doc: PrismicMeta | null): Ref<Readonly<string | null>> => {
      return computed(() => prismicHelpers.getNextPage(wrap(doc).value));
    },

    getPrevPage: (doc: PrismicMeta | null): Ref<Readonly<string | null>> => {
      return computed(() => prismicHelpers.getPrevPage(wrap(doc).value));
    },

    getPageUid: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicHelpers.getPageUid(wrap(page).value));
    },

    getPageId: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicHelpers.getPageId(wrap(page).value));
    },

    getPageType: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicHelpers.getPageType(wrap(page).value));
    },

    getPageHref: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicHelpers.getPageHref(wrap(page).value));
    },

    getPageTags: (page: Document): Ref<Readonly<string[]>> => {
      return computed(() => prismicHelpers.getPageTags(wrap(page).value));
    },

    getPageSlugs: (page: Document): Ref<Readonly<string[]>> => {
      return computed(() => prismicHelpers.getPageSlugs(wrap(page).value));
    },

    getPageLang: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicHelpers.getPageLang(wrap(page).value));
    },

    getBlocks: (data: any, blockName?: any, transform?: any): Ref<Readonly<string | string[]>> => {
      return computed(() => prismicHelpers.getBlocks(wrap(data).value, blockName, transform));
    },

    getSlices: ({ data }: Document, sliceType?: any): Ref<Readonly<any>> => {
      return computed(() => prismicHelpers.getSlices(wrap(data).value, sliceType));
    }
  };

  return {
    loading,
    prismicGetters,
    error,
    doc,
    meta,
    search
  };
}
