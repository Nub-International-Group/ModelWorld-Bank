import axios from 'axios'
import store from '@/store/index'

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.nub.international' : 'http://localhost:4040',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  if (store.state.user.jwt) {
    config.headers.jwt = store.state.user.jwt
  }

  return config
})

export default api
