import axios from 'axios'
import type { AxiosInstance } from 'axios'

const service: AxiosInstance = axios.create({
  // baseURL: 'http://119.91.221.136:3000/',
  baseURL: 'http://music.debug16.cn',
  // baseURL: 'http://y.233c.cn',
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
