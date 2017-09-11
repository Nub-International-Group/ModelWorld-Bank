<template>
  <div id="app">
    <Navbar></Navbar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Nav'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style src="@/assets/main.less" lang="less">