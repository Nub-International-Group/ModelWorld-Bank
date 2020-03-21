<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol xl="9" order="3" order-xl="1">
        <BRow v-if="properties.length">
          <BCol
            v-for="property in propertiesSortedAndFiltered"
            :key="property._id"
            sm="12"
          >
            <PropertyCard :property-id="property._id" />
          </BCol>
        </BRow>
        <h4 v-else>
          Unfortunately, you don't own any assets. Try visiting the market!
        </h4>
      </BCol>
      <BCol xl="3" order="2">
        <BCard :title="!isOwnedView ? 'Assets Market' : 'Your Assets'">
          <BFormGroup label="Search">
            <BFormInput
              v-model="search"
              type="text"
            />
          </BFormGroup>
          <BFormGroup label="Sort By">
            <BFormSelect
              v-model="sortBy"
              :options="sortBys"
            />
          </BFormGroup>
          <BFormGroup label="Sort Order">
            <BFormSelect
              v-model="sortOrder"
              :options="[{ text: 'Descending', value: -1}, { text: 'Ascending', value: 1 }]"
            />
          </BFormGroup>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import PropertyCard from '@/components/PropertyCard'
import Fuse from 'fuse.js'

export default {
  name: 'Properties',
  components: {
    PropertyCard
  },
  data () {
    const sortBys = [
      {
        text: 'Last Valuation',
        value: 'lastValuation'
      },
      {
        text: 'Annual Return',
        value: 'returnRate'
      }
    ]
    return {
      isOwnedView: this.$route.query.view !== 'all',
      search: '',
      sortOrder: -1,
      sortBy: sortBys[0].value,
      sortBys
    }
  },
  computed: {
    properties () {
      return !this.isOwnedView ? this.$store.getters['properties/all'] : this.$store.getters['selectedAccount/properties']
    },
    propertiesFiltered () {
      if (!this.search) {
        return this.properties
      }

      const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'name',
          'description'
        ]
      }

      return new Fuse(this.properties, options).search(this.search)
    },
    propertiesSortedAndFiltered () {
      return this.propertiesFiltered.sort((a, b) => {
        return ((a[this.sortBy] || 0) - (b[this.sortBy] || 0)) * this.sortOrder
      })
    }
  },
  mounted () {
    this.$store.dispatch('properties/fetch')
  }
}
</script>
