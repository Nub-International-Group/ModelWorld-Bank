<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol lg="8">
        <PropertyCard
          :property-id="property._id"
          hide-link
        />
      </BCol>
      <BCol lg="4">
        <BCard no-body>
          <BCardBody class="pb-1">
            <BCardTitle>
              Historical Valuations
            </BCardTitle>
          </BCardBody>
          <BListGroup>
            <BListGroupItem
              v-for="valuation in property.valuations"
              :key="valuation.created"
              class="flex-column align-items-start rounded-0"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ $currency(valuation.amount, property.currency) }}</h5>
                <small>{{ valuation.created }}</small>
              </div>

              <p class="mb-1">
                Valued by: /u/{{ valuation.user }}
              </p>
            </BListGroupItem>
          </BListGroup>
        </BCard>
      </BCol>
      <BCol
        v-if="userIsOwner && canBeTransferred"
        lg="8"
      >
        <PropertyTransferCard :property="property" />
      </BCol>
    </BRow>
  </div>
</template>

<script>
import PropertyCard from '@/components/PropertyCard'
import PropertyTransferCard from '@/components/PropertyTransferCard'
export default {
  name: 'Property',
  components: { PropertyCard, PropertyTransferCard },
  computed: {
    propertyOwner () {
      return this.$store.getters['ui/getAccount'](this.property.owner)
    },
    userIsOwner () {
      return this.property.owner === this.$store.state.selectedAccount.accountId
    },
    property () {
      return this.$store.getters['properties/propertiesById'][this.$route.params.propertyId]
    },
    canBeTransferred () {
      return !this.property.tags.includes('untransferrable')
    }
  }
}
</script>
