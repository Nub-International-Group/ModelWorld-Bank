<template>
  <div class="animated fadeIn">
    <p>
      We only need your basic identity data from Reddit (Join Date, Username, User ID) and will not have access to your posts or have the ability to post as you.
      By using OAuth2, we will never have access to your login credentials or any other personal information. However, by logging into the site you accept
      our terms and conditions.
    </p>

    <BButton
      variant="primary"
      @click="redirectToLogin"
    >
      Login with Reddit
    </BButton>
  </div>
</template>

<script>
import api from '@/api'
export default {
  name: 'Login',
  methods: {
    redirectToLogin () {
      window.location.href = api.defaults.baseURL + '/v1/auth'
    }
  }
}
</script>
