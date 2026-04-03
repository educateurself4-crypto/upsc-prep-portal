import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/upsc-prep-portal/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-ui': ['lucide-react'],
                    'vendor-utils': ['papaparse', 'react-markdown', 'remark-gfm']
                }
            }
        },
        chunkSizeWarningLimit: 1000, // Increase limit slightly as we are managing chunks
    }
})
