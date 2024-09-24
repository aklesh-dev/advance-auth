import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  root: './', // Set the root directory to the current directory (client)
  plugins: [react()],
  build: {
    outDir: 'dist', // Specify the output directory for build files (dist will be created inside client)
  },
});
