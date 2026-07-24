import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'

  return {
    base: offline ? './' : (process.env.VITE_BASE_PATH ?? '/'),
    plugins: [vue(), ...(offline ? [viteSingleFile()] : [])],
    define: offline
      ? {
          'import.meta.env.VITE_OFFLINE': JSON.stringify('true')
        }
      : undefined,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      open: true
    },
    build: offline
      ? {
          outDir: 'dist-offline',
          assetsInlineLimit: 100000000,
          cssCodeSplit: false,
          modulePreload: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true
            }
          }
        }
      : undefined
  }
})
