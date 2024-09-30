// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";

import { router } from "./Router.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </RecoilRoot>
  // </StrictMode>,
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
