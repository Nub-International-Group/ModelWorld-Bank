<template>
  <BTabs>
    <BTab>
      <template slot="title">
        <i class="icon-list" />
      </template>
      <BListGroup class="list-group-accent">
        <BListGroupItem
          v-for="possibleAccount in ownedAccounts"
          :key="possibleAccount._id"
          href="#"
          class="list-group-item-divider"
          :class="{
            'list-group-item-accent-warning': possibleAccount.company,
            'list-group-item-accent-success': !possibleAccount.company
          }"
          @click="selectAccount(possibleAccount)"
        >
          <strong>{{ possibleAccount.name }}</strong><br>
          <small class="text-muted">
            <i class="icon-user" /> {{ possibleAccount.company ? 'Company' : 'Personal' }}
          </small>
        </BListGroupItem>
      </BListGroup>
    </BTab>
  </BTabs>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AccountAside',
  computed: {
    ...mapGetters('accounts', ['ownedAccounts'])
  },
  methods: {
    selectAccount (account) {
      if (account._id !== this.$route.query.accountId) {
        this.$router.push({
          name: this.$route.name,
          params: this.$route.params,
          query: {
            accountId: account._id
          }
        })
      }
    }
  }
}
</script>
