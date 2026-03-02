// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Pages from "vite-plugin-pages";
var __electron_vite_injected_dirname = "C:\\store\\full-stack\\ai-hub";
var electron_vite_config_default = defineConfig({
  main: {
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/main/index.ts"),
          worker: resolve(__electron_vite_injected_dirname, "src/main/worker.ts")
          // worker entry
        }
      }
    }
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@common": resolve(__electron_vite_injected_dirname, "src/common")
        // Shared alias
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      Pages({
        dirs: [{ dir: resolve(__electron_vite_injected_dirname, "src/renderer/src/pages"), baseRoute: "" }],
        extensions: ["tsx"]
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
