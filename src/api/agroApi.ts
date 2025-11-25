import axios from 'axios'


const agroApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})


agroApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { agroApi }