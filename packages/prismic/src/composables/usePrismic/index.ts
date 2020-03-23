import { ref, Ref, computed, isRef } from '@vue/composition-api';
import { PrismicQuery, PrismicMeta, PrismicOptions } from '../../types';
import { Document } from 'prismic-javascript/d.ts/documents';
import loadDocuments from './loadDocuments';
import { prismicGetters as prismicPlainGetters } from '../getters';

type Search = (query: PrismicQuery | PrismicQuery[], options?: PrismicOptions) => Promise<void>;

function wrap<T>(element: Ref<T> | T): Ref<T> {
  return isRef(element) ? element : ref(element);
}

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
      return computed(() => prismicPlainGetters.getPages(wrap(doc).value, pageUid));
    },

    getCurrentPage: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicPlainGetters.getCurrentPage(wrap(doc).value));
    },

    getResultsPerPage: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicPlainGetters.getResultsPerPage(wrap(doc).value));
    },

    getResultsSize: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicPlainGetters.getResultsSize(wrap(doc).value));
    },

    getTotalResultsSize: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicPlainGetters.getTotalResultsSize(wrap(doc).value));
    },

    getTotalPages: (doc: PrismicMeta | null): Ref<Readonly<number>> => {
      return computed(() => prismicPlainGetters.getTotalPages(wrap(doc).value));
    },

    getNextPage: (doc: PrismicMeta | null): Ref<Readonly<string | null>> => {
      return computed(() => prismicPlainGetters.getNextPage(wrap(doc).value));
    },

    getPrevPage: (doc: PrismicMeta | null): Ref<Readonly<string | null>> => {
      return computed(() => prismicPlainGetters.getPrevPage(wrap(doc).value));
    },

    getPageUid: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicPlainGetters.getPageUid(wrap(page).value));
    },

    getPageId: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicPlainGetters.getPageId(wrap(page).value));
    },

    getPageType: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicPlainGetters.getPageType(wrap(page).value));
    },

    getPageHref: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicPlainGetters.getPageHref(wrap(page).value));
    },

    getPageTags: (page: Document): Ref<Readonly<string[]>> => {
      return computed(() => prismicPlainGetters.getPageTags(wrap(page).value));
    },

    getPageSlugs: (page: Document): Ref<Readonly<string[]>> => {
      return computed(() => prismicPlainGetters.getPageSlugs(wrap(page).value));
    },

    getPageLang: (page: Document): Ref<Readonly<string>> => {
      return computed(() => prismicPlainGetters.getPageLang(wrap(page).value));
    },

    getBlocks: (data: any, blockName?: any, transform?: any): Ref<Readonly<string | string[]>> => {
      return computed(() => prismicPlainGetters.getBlocks(wrap(data).value, blockName, transform));
    },

    getSlices: ({ data }: Document, sliceType?: any): Ref<Readonly<any>> => {
      return computed(() => prismicPlainGetters.getSlices(wrap(data).value, sliceType));
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
