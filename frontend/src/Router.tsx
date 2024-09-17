import { createBrowserRouter } from "react-router-dom";

import Layout from "@pages/Layout";
import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import NotFoundPage from "@pages/NotFoundPage";
import MyPage from "@pages/MyPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
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
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
]);
