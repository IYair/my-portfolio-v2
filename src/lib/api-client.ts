import axios from 'axios'

// Cache para evitar llamadas duplicadas
const requestCache = new Map<string, Promise<unknown>>()

// Interceptor para deduplicar requests
axios.interceptors.request.use(
  (config) => {
    const key = `${config.method?.toUpperCase()} ${config.url}`

    // Si ya hay una request activa para esta URL, devolver la promise existente
    if (requestCache.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`)
      return requestCache.get(key)!
    }

    // Crear nueva promise y guardarla en cache
    const requestPromise = axios(config)
    requestCache.set(key, requestPromise)

    // Limpiar cache cuando termine (exitosa o con error)
    requestPromise
      .finally(() => {
        requestCache.delete(key)
      })

    return config
  },
  (error) => Promise.reject(error)
)

// Cliente axios configurado
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient