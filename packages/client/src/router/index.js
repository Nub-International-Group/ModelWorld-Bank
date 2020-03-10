import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Error Page
const Error404 = () => import('@/views/Error404')

// Account level
const Bets = () => import('@/views/Bets')
const Dashboard = () => import('@/views/Dashboard')
const Properties = () => import('@/views/Properties')
const Property = () => import('@/views/Property')
const Transactions = () => import('@/views/Transactions')
const Wages = () => import('@/views/Wages')

// General Pages
const Staff = () => import('@/views/Staff')
const Announcements = () => import('@/views/Announcements')
const Leaderboards = () => import('@/views/Leaderboard')
const LoginSuccess = () => import('@/views/LoginSuccess')
const Login = () => import('@/views/Login')

// Admin Content
const AdminAccounts = () => import('@/views/AdminAccounts')
const AdminAccountTypes = () => import('@/views/AdminAccountTypes')
const AdminProperties = () => import('@/views/AdminProperties')
const AdminSettings = () => import('@/views/AdminSettings')
const AdminWages = () => import('@/views/AdminWages')

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/bets',
          name: 'Bets',
          component: Bets,
          meta: {
            requiredScopes: ['betting']
          }
        },
        {
          path: '/transactions',
          name: 'Transactions',
          component: Transactions
        },
        {
          path: '/wages',
          name: 'Wages',
          component: Wages,
          meta: {
            requiredScopes: ['salary']
          }
        },
        {
          path: '/assets',
          name: 'Assets',
          component: Properties,
          meta: {
            requiredScopes: ['property']
          }
        },
        {
          path: '/assets/:propertyId',
          name: 'Asset',
          component: Property,
          meta: {
            requiredScopes: ['property']
          }
        },
        {
          path: '/rich-list/:type',
          name: 'Forbes Rich List',
          component: Leaderboards
        },
        {
          path: '/404',
          name: 'Error 404',
          component: Error404,
          meta: {
            noLogin: true
          }
        },
        {
          path: '/staff',
          name: 'Staff',
          component: Staff
        },
        {
          path: '/announcements',
          name: 'Announcements',
          component: Announcements
        },
        {
          path: '/login',
          component: Login,
          meta: {
            noLogin: true
          }
        },
        {
          path: '/login/success',
          name: 'LoginSuccess',
          component: LoginSuccess,
          meta: {
            noLogin: true
          }
        },
        {
          path: '/admin',
          name: 'Admin',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'accounts',
              name: 'AdminAccounts',
              component: AdminAccounts,
              meta: {
                requiredScopes: ['admin'],
                label: 'Accounts'
              }
            },
            {
              path: 'wages',
              name: 'AdminWages',
              component: AdminWages,
              meta: {
                requiredScopes: ['admin'],
                label: 'Wages'
              }
            },
            {
              path: 'account-types',
              name: 'AdminAccountTypes',
              component: AdminAccountTypes,
              meta: {
                requiredScopes: ['admin'],
                label: 'Account Types'
              }
            },
            {
              path: 'settings',
              name: 'AdminSettings',
              component: AdminSettings,
              meta: {
                requiredScopes: ['admin'],
                label: 'Settings'
              }
            },
            {
              path: 'properties',
              name: 'AdminProperties',
              component: AdminProperties,
              meta: {
                requiredScopes: ['admin'],
                label: 'Properties'
              }
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

// ensure login
router.beforeEach(async (to, from, next) => {
  // ensure logged in
  if (!to.meta.noLogin && !store.state.user.jwt) {
    if (localStorage.jwt) {
      await store.dispatch('user/login', localStorage.jwt)
      return next()
    }

    return next('/login')
  }

  next()
})

// preserve query string
router.beforeEach(async (to, from, next) => {
  if (from.query.accountId && !to.query.accountId) {
    return next({
      name: to.name,
      params: to.params,
      query: {
        ...to.query,
        accountId: from.query.accountId
      }
    })
  }
  next()
})

// attempt account selection
router.beforeEach(async (to, from, next) => {
  if (!to.query.accountId && store.getters['accounts/ownedAccounts'].length) {
    return next({
      name: to.name,
      params: to.params,
      query: {
        ...to.query,
        accountId: store.getters['accounts/ownedAccounts'][0]._id
      }
    })
  }
  next()
})

// ensure user has scopes for that route
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiredScopes && !to.meta.requiredScopes.every(scope => store.getters['ui/allowedNavScopes'][scope])) {
    return next({
      name: 'Dashboard'
    })
  }
  next()
})

export default router
