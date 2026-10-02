import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH is "/" for a <user>.github.io repo, or "/<repo>/" for a project repo.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
