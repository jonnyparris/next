<template>
  <div>
    <SfHeading
      title="2. Shipping"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <SfInput
        v-model="shippingDetails.firstName"
        label="First name"
        name="firstName"
        class="form__element form__element--half"
        required
      />
      <SfInput
        v-model="shippingDetails.lastName"
        label="Last name"
        name="lastName"
        class="form__element form__element--half form__element--half-even"
        required
      />
      <SfInput
        v-model="shippingDetails.streetName"
        label="Street name"
        name="streetName"
        class="form__element"
        required
      />
      <SfInput
        v-model="shippingDetails.apartment"
        label="House/Apartment number"
        name="apartment"
        class="form__element"
        required
      />
      <SfInput
        v-model="shippingDetails.city"
        label="City"
        name="city"
        class="form__element form__element--half"
        required
      />
      <SfInput
        v-model="shippingDetails.state"
        label="State/Province"
        name="state"
        class="form__element form__element--half form__element--half-even"
        required
      />
      <SfInput
        v-model="shippingDetails.postalCode"
        label="Zip-code"
        name="zipCode"
        class="form__element form__element--half"
        required
      />
      <SfSelect
        v-model="shippingDetails.country"
        label="Country"
        class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
        required
      >
        <SfSelectOption
          v-for="countryOption in COUNTRIES"
          :key="countryOption.key"
          :value="countryOption.key"
        >
          {{ countryOption.label }}
        </SfSelectOption>
      </SfSelect>
      <SfInput
        v-model="shippingDetails.phone"
        label="Phone number"
        name="phone"
        class="form__element"
        required
      />
    </div>
    <SfHeading
      title="Shipping method"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <div class="form__radio-group">
        <SfRadio
          v-for="item in shippingMethods"
          :key="shippingMethodName(item).value"
          :label="getShippingMethodName(item).value"
          :value="getShippingMethodId(item).value"
          :selected="getShippingMethodId(chosenShippingMethod).value"
          @input="() => chosenShippingMethod = item"
          name="shippingMethod"
          :description="getShippingMethodDescription(item).value"
          class="form__element form__radio shipping"
        >
          <template #label="{label}">
            <div class="sf-radio__label shipping__label">
              <div>{{ label }}</div>
              <div>${{ getShippingMethodPrice(item).value }}</div>
            </div>
          </template>
          <template #description="{description}">
            <div class="sf-radio__description shipping__description">
              <div class="shipping__info">
                {{ description }}
              </div>
            </div>
          </template>
        </SfRadio>
      </div>
      <div class="form__action">
        <SfButton class="sf-button--full-width form__action-button" @click="$emit('nextStep')">
          Continue to payment
        </SfButton>
        <SfButton
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
          @click="$emit('click:back')">
            Go back to Personal details
        </SfButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio
} from '@storefront-ui/vue';
import { useCheckout } from '@vue-storefront/commercetools-composables';

const COUNTRIES = [
  { key: 'US',
    label: 'United States' },
  { key: 'UK',
    label: 'United Kingdom' },
  { key: 'IT',
    label: 'Italy' },
  { key: 'PL',
    label: 'Poland' }
];

export default {
  name: 'PersonalDetails',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio
  },
  setup(props, context) {
    context.emit('changeStep', 1);
    const {
      checkoutGetters,
      shippingDetails,
      chosenShippingMethod,
      shippingMethodName,
      shippingMethods
    } = useCheckout();
    const {
      getShippingMethodDescription,
      getShippingMethodPrice,
      getShippingMethodId,
      getShippingMethodName
    } = checkoutGetters;

    return {
      shippingDetails,
      chosenShippingMethod,
      shippingMethods,
      shippingMethodName,
      getShippingMethodDescription,
      getShippingMethodPrice,
      getShippingMethodName,
      getShippingMethodId,
      COUNTRIES
    };
  }
};

</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/variables";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.title {
  margin-bottom: $spacer-extra-big;
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin-bottom: $spacer-extra-big;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding-left: $spacer-extra-big;
        }
      }
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    flex: 1;
    &--secondary {
      margin: $spacer-big 0;
      @include for-desktop {
        order: -1;
        margin: 0;
        text-align: left;
      }
    }
  }
  &__select {
    // todo: remove after SfSelect refactoring
    ::v-deep .sf-select__selected {
      padding: 5px 0;
    }
  }
  &__radio {
    margin-bottom: 0;
    &-group {
      flex: 0 0 100%;
      margin: 0 0 $spacer-extra-big 0;
    }
  }
}
.shipping {
  margin: 0 -#{$spacer-big};
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    width: 100%;
    margin-top: 0;
  }
  &__delivery {
    color: $c-text-muted;
  }
  &__action {
    align-items: center;
    margin-left: $spacer;
    text-decoration: none;
    &::before {
      content: "+";
    }
    &--is-active {
      color: $c-primary;
      &::before {
        content: "-";
      }
    }
  }
  &__info {
    margin-top: $spacer;
  }
}
</style>
