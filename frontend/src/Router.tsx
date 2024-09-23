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
import MyStudyPage from "@pages/MyStudyPage";
import VocabularyPage from "@pages/VocabularyPage";
import TestHistoryPage from "@pages/TestHistoryPage";
import LoginPage from "@pages/LoginPage";
import SignUpPage from "@pages/SignUpPage";

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
        // 임시 path
        path: "tmpsignup",
        element: <SignUpPage />,
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
      {
        path: "mystudy",
        element: <MyStudyPage />,
      },
      {
        path: "testhistory",
        element: <TestHistoryPage />,
      },
      { path: "testhistory", element: <TestHistoryPage /> },
      { path: "vocabulary", element: <VocabularyPage /> },
    ],
  },
]);
