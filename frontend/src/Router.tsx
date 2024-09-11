import { createBrowserRouter } from "react-router-dom";

import MainPage from "@pages/MainPage.tsx";
import SpeakingTestPage from "@pages/SpeakingTestPage.tsx";
import Navbar from "@components/Navbar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "",
        element: <MainPage />,
      },
      {
        path: "speak",
        element: <SpeakingTestPage />,
      },
    ],
  },
]);
