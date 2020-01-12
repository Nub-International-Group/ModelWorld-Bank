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
          component: Bets
        },
        {
          path: '/transactions',
          name: 'Transactions',
          component: Transactions
        },
        {
          path: '/wages',
          name: 'Wages',
          component: Wages
        },
        {
          path: '/properties',
          name: 'Properties',
          component: Properties
        },
        {
          path: '/properties/:propertyId',
          name: 'Property',
          component: Property
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
                admin: true,
                label: 'Accounts'
              }
            },
            {
              path: 'wages',
              name: 'AdminWages',
              component: AdminWages,
              meta: {
                admin: true,
                label: 'Wages'
              }
            },
            {
              path: 'account-types',
              name: 'AdminAccountTypes',
              component: AdminAccountTypes,
              meta: {
                admin: true,
                label: 'Account Types'
              }
            },
            {
              path: 'properties',
              name: 'AdminProperties',
              component: AdminProperties,
              meta: {
                admin: true,
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

router.beforeEach((to, from, next) => {
  if (!to.meta.noLogin && !store.state.user.jwt) {
    if (localStorage.jwt) {
      store.commit('user/setJWT', { jwt: localStorage.jwt })
      return next()
    }

    return next('/login')
  }

  if (to.meta.admin && !store.state.user.userDetails.admin) {
    return next('/')
  }

  next()
})

router.beforeEach((to, from, next) => {
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

export default router
