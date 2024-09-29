// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import axios from "axios";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./Router"; // AppRouter로 변경

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

// 새로운 AppRouter를 사용하여 모바일과 웹을 분기
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={new QueryClient()}>
      <AppRouter /> {/* RouterProvider가 AppRouter 안에 들어있음 */}
    </QueryClientProvider>
  </RecoilRoot>
  // </StrictMode>
);

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (!registration) {
      // 서비스 워커가 아직 등록되지 않은 경우에만 등록
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "서비스 워커가 성공적으로 등록되었습니다:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("서비스 워커 등록 중 오류가 발생했습니다:", error);
        });
    } else {
      console.log("이미 서비스 워커가 등록되어 있습니다:", registration.scope);
    }
  });
}
