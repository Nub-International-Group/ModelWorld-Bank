<template>
  <div id="PageLoginSuccess">
    <div class="page-header">
      <h1>Login Success
        <small>Reddit API Succesfully Contacted</small>
      </h1>
    </div>
    <br>
    <p> This page will redirect once your session has been fully established. Please hold.</p>
  </div>
</template>

<script>
export default {
  name: 'PageLoginSuccess',
  data: function () {
    return {}
  },
  methods: {
    startLogin: function () {
      window.location.href = '/api/auth/login'
    }
  },
  mounted: function () {
    console.log('hmm')
  }
}
</script>