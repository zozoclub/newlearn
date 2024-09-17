import { createBrowserRouter } from "react-router-dom";
import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import NotFoundPage from "@pages/NotFoundPage";
import MyPage from "@pages/MyPage";
import App from "./App";
import NewsPage from "@pages/NewsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "news",
        element: <NewsPage />,
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
