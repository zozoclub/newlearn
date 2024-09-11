import { createBrowserRouter } from "react-router-dom";

import MainPage from "@pages/MainPage.tsx";
import SpeakingTestPage from "@pages/SpeakingTestPage.tsx";
import Navbar from "@components/Navbar";
import NotFoundPage from "@pages/notFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "main",
        element: <MainPage />,
      },
      {
        path: "speak",
        element: <SpeakingTestPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
