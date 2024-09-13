// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { router } from "./Router.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
  // </StrictMode>,
);
