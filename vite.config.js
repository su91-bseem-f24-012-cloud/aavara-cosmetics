import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the built assets use relative paths, so the site works
// whether it's hosted at username.github.io or username.github.io/repo-name
// without needing to hardcode the repo name here.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
