import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@lib": path.resolve(__dirname, "src/lib"),
		},
	},
});
