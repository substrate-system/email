import { defineConfig } from 'vite'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        global: 'globalThis'
    },
    root: 'example',
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    publicDir: '_public',
    css: {
        postcss: {
            plugins: [
                postcssNesting
            ],
        },
    },
    server: {
        port: 8888,
        host: true,
        open: true,
    },
    build: {
        minify: false,
        outDir: '../public',
        emptyOutDir: true,
        sourcemap: 'inline'
    },
    test: {
        // environment: 'jsdom',
        globals: true,
        include: ['../tests/*.ts'],  // b/c root dir is example
        browser: {
            provider: 'playwright', // or 'webdriverio'
            headless: true,
            enabled: true,
            // at least one instance is required
            instances: [
                { browser: 'chromium' },
            ],
        },
    },
})
