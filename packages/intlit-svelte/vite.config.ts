import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "intlit-svelte",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["svelte", "intlit-core"],
      output: {
        globals: {
          svelte: "Svelte",
          "intlit-core": "intlit-core",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
