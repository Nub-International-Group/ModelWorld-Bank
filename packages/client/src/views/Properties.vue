<template>
  <div class="animated fadeIn">
    <h3>{{ isAllView ? 'Property Market' : 'Your Properties' }}</h3>

    <BRow v-if="properties.length">
      <BCol
        v-for="property in properties"
        :key="property._id"
        lg="12"
        xl="6"
      >
        <PropertyCard :property-id="property._id" />
      </BCol>
    </BRow>
    <h4 v-else>
      Unfortunately, you don't own any properties. Try visiting the market!
    </h4>
  </div>
</template>

<script>
import PropertyCard from '../components/PropertyCard'
export default {
  name: 'Properties',
  components: {
    PropertyCard
  },
  computed: {
    isAllView () {
      return this.$route.query.view === 'all'
    },
    isOwnedView () {
      return !this.isAllView
    },
    properties () {
      return this.isAllView ? this.$store.state.properties.all : this.$store.getters['selectedAccount/properties']
    }
  },
  mounted () {
    this.$store.dispatch('properties/fetch')
  }
}
</script>
