import axios from 'axios'

// Cliente axios configurado - el caching ahora se maneja en Zustand store
export const apiClient = axios.create({
  timeout: 30000, // Increased timeout to match Zustand store
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient