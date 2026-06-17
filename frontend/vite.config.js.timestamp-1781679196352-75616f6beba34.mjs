// vite.config.js
import { defineConfig } from "file:///sessions/trusting-pensive-maxwell/mnt/FC%EC%98%A8%20%EB%A6%AC%EA%B7%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20%EC%98%88%EC%A0%9C/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/trusting-pensive-maxwell/mnt/FC%EC%98%A8%20%EB%A6%AC%EA%B7%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20%EC%98%88%EC%A0%9C/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 개발 중 /api 요청을 백엔드로 프록시
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvdHJ1c3RpbmctcGVuc2l2ZS1tYXh3ZWxsL21udC9GQ1x1QzYyOCBcdUI5QUNcdUFERjhcdUMwQUNcdUM3NzRcdUQyQjggXHVCOUNDXHVCNEU0XHVBRTMwIFx1QzYwOFx1QzgxQy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3RydXN0aW5nLXBlbnNpdmUtbWF4d2VsbC9tbnQvRkNcdUM2MjggXHVCOUFDXHVBREY4XHVDMEFDXHVDNzc0XHVEMkI4IFx1QjlDQ1x1QjRFNFx1QUUzMCBcdUM2MDhcdUM4MUMvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3RydXN0aW5nLXBlbnNpdmUtbWF4d2VsbC9tbnQvRkMlRUMlOTglQTglMjAlRUIlQTYlQUMlRUElQjclQjglRUMlODIlQUMlRUMlOUQlQjQlRUQlOEElQjglMjAlRUIlQTclOEMlRUIlOTMlQTQlRUElQjglQjAlMjAlRUMlOTglODglRUMlQTAlOUMvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgLy8gXHVBQzFDXHVCQzFDIFx1QzkxMSAvYXBpIFx1QzY5NFx1Q0NBRFx1Qzc0NCBcdUJDMzFcdUM1RDRcdUI0RENcdUI4NUMgXHVENTA0XHVCODVEXHVDMkRDXG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdkLFNBQVMsb0JBQW9CO0FBQzdlLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
