<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol
        sm="12"
        md="6"
      >
        <BCard>
          <template v-slot:header>
            <h4>Users</h4>
          </template>
          <b-list-group>
            <b-list-group-item v-for="(user) in accountUsers" :key="user.username">
              <div class="float-left">
                <strong>{{ user.username }}</strong>
              </div>
              <div class="float-right">
                <strong>{{ user.level | accessLevel }}</strong>
              </div>
            </b-list-group-item>
          </b-list-group>
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
import api from '@/api'
const ACCESS_LEVELS = ['No Access', 'Read', 'Read/Write', 'Owner']

export default {
  name: 'Settings',
  data () {
    return {
      username: '',
      level: 0
    }
  },
  computed: {
    accountUsers () {
      const usersMap = this.$store.getters['selectedAccount/account'].users
      const unsortedUsers = []
      for (const username in usersMap) {
        unsortedUsers.push({
          username: username,
          level: usersMap[username]
        })
      }

      return unsortedUsers.sort((a, b) => a.level - b.level)
    }
  },
  methods: {
    async putUser () {
      try {
        await api.request({
          url: '/v1/settings',
          method: 'PUT',
          data: this.settings
        })
        await this.$store.dispatch('ui/fetchSettings')
        this.resetChanges()
      } catch (err) {
        this.$store.dispatch('messages/handleError', { err })
      }
    }
  },
  filters: {
    accessLevel (level) {
      return ACCESS_LEVELS[level]
    }
  }
}
</script>
