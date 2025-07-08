import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make server URL available in client code
    '__SERVER_URL__': JSON.stringify(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000')
  }
})
