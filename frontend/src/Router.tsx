import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import SpeakingTestResultPage from "@pages/SpeakingTestResultPage";
import WordTestPage from "@pages/WordTestPage";
import WordTestResultPage from "@pages/WordTestResultPage";
import NewsPage from "@pages/NewsPage";
import MyPage from "@pages/MyPage";
import MyStudyPage from "@pages/MyStudyPage";
import VocabularyPage from "@pages/VocabularyPage";
import WordTestHistoryPage from "@pages/WordTestHistoryPage";
import SpeakingTestHistoryPage from "@pages/SpeakingTestHistoryPage";
import NewsSearchPage from "@pages/NewsSearchPage";
import LoginPage from "@pages/LoginPage";
import SignUpPage from "@pages/SignUpPage";
import LandingPage from "@pages/LandingPage";
import NewsDetailPage from "@pages/NewsDetailPage";
import NotFoundPage from "@pages/NotFoundPage";
import PrivateRoute from "@hooks/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: "speakingtest",
            element: <SpeakingTestPage />,
          },
          {
            path: "speaking/result/:audioFileId",
            element: <SpeakingTestResultPage />,
          },
          {
            path: "wordtest",
            element: <WordTestPage />,
          },
          {
            path: "word/result/:quizId",
            element: <WordTestResultPage />,
          },
          {
            path: "news/:category/:page",
            element: <NewsPage />,
          },
          {
            path: "news/detail/:newsId",
            element: <NewsDetailPage />,
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
            path: "wordtesthistory",
            element: <WordTestHistoryPage />,
          },
          {
            path: "speakingtesthistory",
            element: <SpeakingTestHistoryPage
            />,
          },
          {
            path: "voca",
            element: <VocabularyPage />,
          },
          {
            path: "news/search",
            children: [
              { index: true, element: <NewsSearchPage /> },
              { path: ":query", element: <NewsSearchPage /> },
            ],
          },
        ],
      },
      {
        path: "landing",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "tmpsignup",
        element: <SignUpPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
