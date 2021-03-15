import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: process.env.CONNECT_URL
})
export default ({ Vue, store }) => {
  Vue.prototype.$axios = axiosInstance
  store.$axios = axiosInstance
}
export { axiosInstance }
