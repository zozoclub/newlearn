// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { ThemeProvider } from "@context/ThemeContext.tsx";
import { GlobalStyle } from "@styles/GlobalStyle.tsx";
import Background from "@styles/BackGround.tsx";
import { router } from "./Router.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RecoilRoot>
    <ThemeProvider>
      <GlobalStyle />
      <Background />
      <RouterProvider router={router} />
    </ThemeProvider>
  </RecoilRoot>
  // </StrictMode>,
);
