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
import PrivateRoute from "@hooks/PrivateRoute";
import LandingPage from "@pages/LandingPage";

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
            path: "speak",
            element: <SpeakingTestPage />,
          },
          {
            path: "speakresult/:audioFileId",
            element: <SpeakingTestResultPage />,
          },
          {
            path: "wordtest/:totalCount",
            element: <WordTestPage />,
          },
          {
            path: "wordtestresult/:quizId",
            element: <WordTestResultPage />,
          },
          {
            path: "news",
            element: <NewsPage />,
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
          {
            path: "voca",
            element: <VocabularyPage />,
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
