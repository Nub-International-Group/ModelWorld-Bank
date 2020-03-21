<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler
        class="d-lg-none"
        display="md"
        mobile
      />
      <BLink
        class="navbar-brand"
        to="#"
      >
        <img
          class="navbar-brand-full"
          src="img/logo_transparent_2.png"
          height="100%"
          alt="CoreUI Logo"
        >
        <img
          class="navbar-brand-minimized"
          src="img/brand/sygnet.svg"
          width="30"
          height="30"
          alt="CoreUI Logo"
        >
      </BLink>
      <SidebarToggler
        class="d-md-down-none"
        display="lg"
      />
      <BNavbarNav class="ml-auto d-none d-lg-block">
        <BNavItem
          v-if="account"
          class="px-3"
        >
          <strong>Current Account:</strong> {{ account.name || 'None Selected' }}
        </BNavItem>
      </BNavbarNav>
      <AsideToggler :mobile="true" />
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :nav-items="allowedNav" />
        <SidebarFooter />
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list" />
        <div class="container-fluid">
          <RouterView v-if="$route.meta.noLogin" />
          <AccountWrapper v-else/>
        </div>
      </main>
      <AppAside>
        <AccountAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <span class="ml-1">
          &copy; 2020 Stridey & Viljo & Padanub
        </span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">
          <a>{{ version }} | {{ serverVersion }}</a>
        </span>
        <!-- Powered by the salty tears of MHOC -->
      </div>
    </TheFooter>
  </div>
</template>

<script>
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
  Breadcrumb
} from '@coreui/vue'

import AccountAside from '../components/AccountAside'
import AccountWrapper from '../components/AccountWrapper'
import { mapState, mapGetters } from 'vuex'
import nav from '@/_nav'
import api from '@/api'
import miniToastr from 'mini-toastr'

import { version } from '../../package.json'

export default {
  name: 'DefaultContainer',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    AccountAside,
    AccountWrapper,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav
  },
  data () {
    return {
      nav: nav.items,
      version: process.env.NODE_ENV === 'production' ? version : 'dev',
      serverVersion: '...'
    }
  },
  computed: {
    ...mapGetters({
      account: 'selectedAccount/account',
      allowedNavScopes: 'ui/allowedNavScopes'
    }),
    ...mapState({
      userDetails: state => state.user.userDetails,
      toasts: state => state.messages.queue
    }),
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label)
    },
    allowedNav () {
      return nav.items.filter(nav => nav.requiredScopes ? nav.requiredScopes.every(scope => !!this.allowedNavScopes[scope]) : true)
    }
  },
  watch: {
    toasts: function (val) {
      const latest = this.toasts[this.toasts.length - 1]

      miniToastr[latest.type](latest.message, latest.title)
    }
  },
  mounted () {
    api.get('/v1/healthz').then((res) => {
      this.serverVersion = res.data.version
    })

    miniToastr.init()
  }
}

</script>
