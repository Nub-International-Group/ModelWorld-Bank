<template>
  <BCard
    no-body
  >
    <BCardBody>
      <BRow>
        <BCol md="4" class="d-flex align-items-center">
          <img :src="property.image" width="100%">
        </BCol>
        <BCol md="8" class="pt-1 pt-md-0">
          <div class="d-flex justify-content-between">
            <h4 class="mb-1">{{ property.name }}</h4>
            <BBtn
              v-if="!hideLink"
              @click="$router.push({ name: 'Property', params: { propertyId: property._id }})"
            >
              More Info
            </BBtn>
          </div>
          <h6>{{ $currency(property.returnRate, property.currency) }} per annum return</h6>
          <h6 v-if="lastValuation">{{ $currency(lastValuation, property.currency) }} last sale price</h6>
          <h6>Current owner: {{ propertyOwner ? propertyOwner.name : 'N/A' }}</h6>
          <p>{{ property.description }}</p>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

<script>
export default {
  name: 'PropertyCard',
  props: {
    propertyId: {
      type: String,
      default: null
    },
    hideLink: {
      type: Boolean,
      default: false
    },
    detailed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getAccount () {
      return this.$store.getters['ui/getAccount']
    },
    propertyOwner () {
      return this.getAccount(this.property.owner)
    },
    property () {
      return this.propertyId ? this.$store.getters['properties/propertiesById'][this.propertyId] : null
    },
    lastValuation () {
      if (!this.property) return null
      const length = this.property.valuations.length
      return length ? this.property.valuations[length - 1].amount : null
    }
  }
}
</script>
