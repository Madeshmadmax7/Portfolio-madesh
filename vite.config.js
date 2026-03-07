import { defineConfig, transformWithEsbuild } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        {
            name: 'treat-js-files-as-jsx',
            enforce: 'pre',
            async transform(code, id) {
                if (!id.endsWith('.js') || id.includes('node_modules')) return null;
                return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
            },
        },
        react(),
        tailwindcss(),
    ],

    publicDir: 'public',

    server: {
        port: 5173,
    },

    build: {
        outDir: 'build',
        sourcemap: true,
    },

    optimizeDeps: {
        include: ['three', '@react-three/fiber'],
        esbuildOptions: {
            loader: { '.js': 'jsx' },
        },
    },
});
