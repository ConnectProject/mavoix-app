import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'http://connect-project.io/'
})
export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}
export { axiosInstance }
