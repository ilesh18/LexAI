import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Redirect TanStack Start's bundled server entry to src/server.ts if on Cloudflare.
export default defineConfig(({ command }) => ({
  plugins: [
    tanstackStart({
      server: process.env.CLOUDFLARE === "true" ? { entry: "server" } : undefined,
    }),
    nitro({
      preset: process.env.VERCEL === "1" ? "vercel" : undefined,
    }),
    viteReact(),
    tailwindcss(),
    tsConfigPaths(),
    command === "build" && process.env.CLOUDFLARE === "true" ? cloudflare() : null,
  ],
  optimizeDeps: {
    exclude: [
      "@tanstack/react-start",
      "@tanstack/start-server-core",
      "@tanstack/start-client-core",
    ],
  },
}));
