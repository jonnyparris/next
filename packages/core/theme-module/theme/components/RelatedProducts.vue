<template>
  <SfSection v-if="relatedProducts.length > 0" :title-heading="title" class="section">
    <SfCarousel class="product-carousel">
      <SfCarouselItem v-for="(product, i) in relatedProducts" :key="i">
        <SfProductCard
          :title="getProductName(product)"
          :image="getProductGallery(product)[0].normal"
          :regular-price="getProductPrice(product)"
          :link="`/p/${getProductSlug(product)}`"
          class="product-card"
        />
      </SfCarouselItem>
    </SfCarousel>
  </SfSection>
</template>

<script lang="ts">
import { computed } from '@vue/composition-api';

import {
  SfCarousel,
  SfProductCard,
  SfSection
} from '@storefront-ui/vue';
import { useProduct } from '<%= options.composables %>';

export default {
  name: 'RelatedProducts',

  components: {
    SfCarousel,
    SfProductCard,
    SfSection
  },

  props: {
    title: String,
    product: Object
  },

  setup({ product }) {
    const { productGetters, products, search, loading } = useProduct('related-products');
    const categories = productGetters.getCategories(product);
    const relatedProducts = computed(() => productGetters.getVariants(products, { masters: true }).value
      .filter((prod) => productGetters.getId(prod) !== productGetters.getId(product)));

    if (categories.length > 0) {
      search({ catId: [categories[0]] });
    }

    return {
      relatedProducts,
      search,
      loading,
      getProductSlug: product => productGetters.getSlug(product),
      getProductName: product => productGetters.getName(product),
      getProductGallery: product => productGetters.getGallery(product),
      getProductPrice: product => productGetters.getPrice(product)
    };
  }
};
</script>
