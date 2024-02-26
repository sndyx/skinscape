import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		// Holy shit thank god theyre gone oh my god Holy shit oh my goodness Hoyl fuck Thank you jesus
		if (warning.code.startsWith('a11y-')) return;
		handler(warning);
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
