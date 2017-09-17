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
  store: ['user'],
  data: function () {
    return {}
  },
  created: function () {
    let app = this
    axios.get('/api/auth/jwt').then(function (response) {
      app.user = jwt.decode(response.data.jwt)
      // app.$router.push('/')
    }).catch(function (err) {
      console.log(err)
      app.$router.push('/login')
    })
  }
}
</script>