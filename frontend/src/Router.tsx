import { useMediaQuery } from "react-responsive";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

// Web Router
import MainPage from "@pages/MainPage";
import SpeakingTestPage from "@pages/SpeakingTestPage";
import SpeakingTestResultPage from "@pages/SpeakingTestResultPage";
import WordTestPage from "@pages/WordTestPage";
import WordTestResultPage from "@pages/WordTestResultPage";
import NewsPage from "@pages/NewsPage";
import MyPage from "@pages/MyPage";
import MyStudyPage from "@pages/MyStudyPage";
import VocabularyPage from "@pages/VocabularyPage";
import TestHistoryPage from "@pages/TestHistoryPage";
import LoginPage from "@pages/LoginPage";
import SignUpPage from "@pages/SignUpPage";
import LandingPage from "@pages/LandingPage";
import NewsDetailPage from "@pages/NewsDetailPage";
import NotFoundPage from "@pages/NotFoundPage";
import PrivateRoute from "@hooks/PrivateRoute";

// Mobile Router
import LoginMobilePage from "@pages/mobile/LoginMobilePage";
import WordTestIntroMobilePage from "@pages/mobile/WordTestIntroMobilePage";
import WordTestStartMobilePage from "@pages/mobile/WordTestStartMobilePage";
import WordTestMobilePage from "@pages/mobile/WordTestMobilePage";
import WordTestResultDetailMobilePage from "@pages/mobile/WordTestResultDetailMobilePage";
import WordTestResultListMobilePage from "@pages/mobile/WordTestResultListMobilePage";
import SpeakingTestIntroMobilePage from "@pages/mobile/SpeakingTestIntroMobilePage";
import SpeakingTestStartMobilePage from "@pages/mobile/SpeakingTestStartMobilePage";
import SpeakingTestMobilePage from "@pages/mobile/SpeakingTestMobilePage";
import SpeakingTestResultDetailMobilePage from "@pages/mobile/SpeakingTestResultDetailMobilePage";
import SpeakingTestResultListMobilePage from "@pages/mobile/SpeakingTestResultListMobilePage";

// 모바일 여부를 체크하는 hook
const useIsMobile = () => {
  return useMediaQuery({ query: "(max-width: 768px)" });
};

export const AppRouter = () => {
  const isMobile = useIsMobile();

  // 모바일 라우팅 설정
  const mobileRoutes = [
    {
      path: "/m",
      element: <App />,
      children: [
        {
          element: <PrivateRoute />,
          children: [
            { index: true, element: <MainPage /> },
            { path: "speaking", element: <SpeakingTestIntroMobilePage /> },
            { path: "speakingtest", element: <SpeakingTestMobilePage /> },
            { path: "speakingtest/start", element: <SpeakingTestStartMobilePage /> },
            { path: "speakingtest/result/:audioFileId", element: <SpeakingTestResultDetailMobilePage /> },
            { path: "speakingtest/result/list", element: <SpeakingTestResultListMobilePage /> },
            { path: "word", element: <WordTestIntroMobilePage /> },
            { path: "wordtest", element: <WordTestMobilePage /> },
            { path: "wordtest/start", element: <WordTestStartMobilePage /> },
            { path: "wordtest/result/:quizId", element: <WordTestResultDetailMobilePage /> },
            { path: "wordtest/result/list", element: <WordTestResultListMobilePage /> },
          ],
        },
        { path: "login", element: <LoginMobilePage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "*", element: <NotFoundPage /> },
      ]
    },
  ];

  // 웹 라우팅 설정
  const webRoutes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          element: <PrivateRoute />,
          children: [
            { index: true, element: <MainPage /> },
            { path: "speakingtest", element: <SpeakingTestPage /> },
            { path: "speaking/result/:audioFileId", element: <SpeakingTestResultPage /> },
            { path: "wordtest", element: <WordTestPage /> },
            { path: "word/result/:quizId", element: <WordTestResultPage /> },
            {
              path: "news",
              element: <NewsPage />,
              children: [{ path: "detail/:newsId", element: <NewsDetailPage /> }],
            },
            { path: "mypage", element: <MyPage /> },
            { path: "mystudy", element: <MyStudyPage /> },
            { path: "testhistory", element: <TestHistoryPage /> },
            { path: "voca", element: <VocabularyPage /> },
          ],
        },
        { path: "landing", element: <LandingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ];

  // 모바일과 웹의 라우터를 분기
  const router = createBrowserRouter(isMobile ? mobileRoutes : webRoutes);

  return <RouterProvider router={router} />;
};
