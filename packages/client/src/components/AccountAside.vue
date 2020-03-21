<template>
  <BTabs>
    <BTab>
      <template slot="title">
        <i class="icon-list" />
      </template>
      <BListGroup class="list-group-accent">
        <BListGroupItem v-if="!accounts.length">
          No other accounts to select from.
        </BListGroupItem>
        <BListGroupItem
          v-else
          v-for="possibleAccount in accounts"
          href="#"
          :key="possibleAccount._id"
          class="list-group-item-divider"
          :class="{
            'list-group-item-accent-warning': possibleAccount.accountType.corporate,
            'list-group-item-accent-success': !possibleAccount.accountType.corporate
          }"
          @click="selectAccount(possibleAccount)"
        >
          <strong>{{ possibleAccount.name }}</strong><br>
          <small class="text-muted">
            <i class="icon-user" /> {{ possibleAccount.accountType.corporate ? 'Company' : 'Personal' }}
          </small>
        </BListGroupItem>
      </BListGroup>
    </BTab>
  </BTabs>
</template>

<script>
export default {
  name: 'AccountAside',
  computed: {
    accounts () {
      return this.$store.getters['accounts/ownedAccounts']
        .filter(account => account._id !== this.$store.state.selectedAccount.accountId)
        .sort((a, b) => a.name < b.name ? -1 : 1)
    }
  },
  methods: {
    selectAccount (account) {
      if (account._id !== this.$route.query.accountId) {
        this.$router.push({
          name: 'Dashboard',
          query: {
            accountId: account._id
          }
        })
      }
    }
  }
}
</script>
