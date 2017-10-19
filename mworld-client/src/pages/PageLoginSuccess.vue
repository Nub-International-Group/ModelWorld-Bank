<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>Login Success
        <small>Reddit API Succesfully Contacted</small>
      </h1>
    </div>
    <br>
    <p> This page will redirect once your session has been fully established. Please hold.</p>
    <p> Name: {{user.name}} </p>
  </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  name: 'PageLoginSuccess',
  store: ['user', 'jwt'],
  data: function () {
    return {}
  },
  created: function () {
    let $this = this
    axios.get('/api/auth/jwt').then(function (response) {
      $this.jwt = response.data.jwt
      console.log($this.jwt)
      $this.user = jwt.decode(response.data.jwt)

      $this.$router.push('/')
    }).catch(function (err) {
      console.log(err)
      $this.$router.push('/login')
    })
  }
}
</script>