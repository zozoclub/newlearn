import { createBrowserRouter } from "react-router-dom";
import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import SpeakingTestResultPage from "@pages/SpeakingTestResultPage";
import WordTestPage from "@pages/WordTestPage";
import WordTestResultPage from "@pages/WordTestResultPage";
import NotFoundPage from "@pages/NotFoundPage";
import MyPage from "@pages/MyPage";
import App from "./App";
import NewsPage from "@pages/NewsPage";
import TestHistoryPage from "@pages/TestHistoryPage";
import LoginPage from "@pages/LoginPage";
import SignInPage from "@pages/SignInPage";
import VocabularyPage from "@pages/VocabularyPage";

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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
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
        path: "wordtestresult",
        element: <WordTestResultPage />,
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
      {path: "vocabulary", element: <VocabularyPage/> }
    ],
  },
]);
