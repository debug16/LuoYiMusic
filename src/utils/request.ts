import axios from 'axios'
import type { AxiosInstance } from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: ''
  // baseURL: ''
  // baseURL: ''
  // baseURL: ''
  timeout: 10000,
})

// response 拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
