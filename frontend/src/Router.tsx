import { createBrowserRouter } from "react-router-dom";
import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import SpeakingTestResultPage from "@pages/SpeakingTestResultPage";
import WordTestPage from "@pages/WordTestPage";
import NotFoundPage from "@pages/NotFoundPage";
import MyPage from "@pages/MyPage";
import App from "./App";
import NewsPage from "@pages/NewsPage";
import TestHistoryPage from "@pages/TestHistoryPage";

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
        path: "speakresult",
        element: <SpeakingTestResultPage />,
      },
      {
        path: "wordtest",
        element: <WordTestPage />,
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
      { path: "testhistory", element: <TestHistoryPage /> },
    ],
  },
]);
