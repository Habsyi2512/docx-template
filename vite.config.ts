import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// server: {
	// 	allowedHosts: ['c8cd2ee3f138.ngrok-free.app']
	// }
});
