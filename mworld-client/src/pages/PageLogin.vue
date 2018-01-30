<template>
    <div id="PageLogin">
        <div class="page-header">
            <h1>Login
                <small>Access our site with your Reddit account</small>
            </h1>
        </div>
        <br>
        <p> We only need your basic identity data from Reddit (Join Date, Username, User ID) and will not have access to your posts or have the ability to post as you.
          By using OAuth2, we will never have access to your login credentials or any other personal information. However, by logging into the site you accept
          our terms and conditions.</p>

        <button type="button" class="btn btn-info" v-on:click="startLogin">Login with Reddit</button>
    </div>
</template>

<script>
export default {
  name: 'PageLogin',
  data: function () {
    return {}
  },
  methods: {
    startLogin: function () {
      window.location.href = '/api/auth/login'
    }
  }
}
</script>
