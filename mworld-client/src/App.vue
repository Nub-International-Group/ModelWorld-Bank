<template>
  <div id="app">
    <Navbar></Navbar>

    <div class="container">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
        </transition>
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

<style src="@/assets/main.less" lang="less" />

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>