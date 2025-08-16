// vite.config.js
import { defineConfig } from "file:///D:/projects/billing/billing-app/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///D:/projects/billing/billing-app/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "node:path";
import electron from "file:///D:/projects/billing/billing-app/node_modules/vite-plugin-electron/dist/simple.mjs";
import react from "file:///D:/projects/billing/billing-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\projects\\billing\\billing-app";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.js"
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__vite_injected_original_dirname, "electron/preload.js")
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === "test" ? void 0 : {}
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxiaWxsaW5nXFxcXGJpbGxpbmctYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxiaWxsaW5nXFxcXGJpbGxpbmctYXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0cy9iaWxsaW5nL2JpbGxpbmctYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0YWlsd2luZGNzcygpLFxuICAgIGVsZWN0cm9uKHtcbiAgICAgIG1haW46IHtcbiAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLmxpYi5lbnRyeWAuXG4gICAgICAgIGVudHJ5OiAnZWxlY3Ryb24vbWFpbi5qcycsXG4gICAgICB9LFxuICAgICAgcHJlbG9hZDoge1xuICAgICAgICAvLyBTaG9ydGN1dCBvZiBgYnVpbGQucm9sbHVwT3B0aW9ucy5pbnB1dGAuXG4gICAgICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgICBpbnB1dDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2VsZWN0cm9uL3ByZWxvYWQuanMnKSxcbiAgICAgIH0sXG4gICAgICAvLyBQbG95ZmlsbCB0aGUgRWxlY3Ryb24gYW5kIE5vZGUuanMgQVBJIGZvciBSZW5kZXJlciBwcm9jZXNzLlxuICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cbiAgICAgIC8vIFNlZSBcdUQ4M0RcdURDNDkgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uLXZpdGUvdml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcbiAgICAgIHJlbmRlcmVyOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi12aXRlL3ZpdGUtcGx1Z2luLWVsZWN0cm9uLXJlbmRlcmVyL2lzc3Vlcy83OCNpc3N1ZWNvbW1lbnQtMjA1MzYwMDgwOFxuICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICA6IHt9LFxuICAgIH0pLFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVIsU0FBUyxvQkFBb0I7QUFDcFQsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sY0FBYztBQUNyQixPQUFPLFdBQVc7QUFKbEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBO0FBQUEsUUFFSixPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBUztBQUFBO0FBQUE7QUFBQSxRQUdQLE9BQU8sS0FBSyxLQUFLLGtDQUFXLHFCQUFxQjtBQUFBLE1BQ25EO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJQSxVQUFVLFFBQVEsSUFBSSxhQUFhLFNBRS9CLFNBQ0EsQ0FBQztBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
