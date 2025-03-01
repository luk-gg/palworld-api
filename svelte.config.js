import adapter from '@sveltejs/adapter-auto';
import path from 'path'

const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$client: path.resolve('.', 'game/client'),
		},
		// Overrides default routes directory to utils/routes. In the case of custom route logic, copy utils/routes and app.html to src and comment out the overrides below.
		files: {
			routes: "utils/routes",
			appTemplate: "utils/app.html"
		},
	},
};

export default config;
