// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";

import { router } from "./Router.tsx";
import "./index.css";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
  // </StrictMode>,
);

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("서비스 워커가 등록되었습니다.", registration.scope);
    })
    .catch((error) => {
      console.log("서비스 워커 등록 실패:", error);
    });
}
