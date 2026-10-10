import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repository-name>/.
// If your repository is not called "smart-fishing", change the fallback below
// (or set VITE_BASE when building).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/smart-fishing/',
})
