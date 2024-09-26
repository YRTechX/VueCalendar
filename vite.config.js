import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"), // Замените 'src' на путь к вашей папке с исходным кодом, если он другой
        },
    },
});
