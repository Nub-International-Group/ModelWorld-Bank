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
          <h5>Edit User</h5>
          <b-form-group
            label="Username without /u/"
          >
            <b-form-input v-model="username" trim />
          </b-form-group>
          <b-form-group
            label="Access Level"
          >
            <b-form-select v-model="level" :options="ACCESS_LEVELS" />
          </b-form-group>
          <BBtn
            variant="success"
            @click="editUser"
          >
            Edit User
          </BBtn>
          <br/><br/>
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
const ACCESS_LEVELS = [{ text: 'No Access', value: 0 }, { text: 'Read', value: 1 }, { text: 'Read/Write', value: 2 }, { text: 'Owner', value: 3 }]

export default {
  name: 'Settings',
  data () {
    return {
      username: '',
      level: 0,
      ACCESS_LEVELS
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
    async editUser () {
      await this.$store.dispatch('selectedAccount/editUser', { username: this.username, level: this.level })
    }
  },
  filters: {
    accessLevel (level) {
      return ACCESS_LEVELS.find(lvl => lvl.value === level).text
    }
  }
}
</script>
