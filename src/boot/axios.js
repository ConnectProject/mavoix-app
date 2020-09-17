import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://connect-project.io/'
})
export default ({ Vue, store }) => {
  Vue.prototype.$axios = axiosInstance
  store.$axios = axiosInstance
}
export { axiosInstance }
