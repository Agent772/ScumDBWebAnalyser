import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['all'],
    // allowedHosts: [
    //   'scumdb-analyzer.agent772-tools.de',
    //   'scumdb-webanalyzer.agent772-tools.de',
    //   'scum-analyzer.agent772-tools.de',
    //   'scum-web-analyzer.agent772-tools.de',
    // ],
  },
});
