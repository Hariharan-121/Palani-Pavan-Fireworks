import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Sri Palani Pavan Fireworks",
        short_name: "SPP Fireworks",
        start_url: "/",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#f8931f",
        description: "Premium Sivakasi Fireworks for your family celebrations.",
        icons: [
          {
            src: "/spp-logo.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/spp-logo.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
})
