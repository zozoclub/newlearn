import { useQuery } from "@tanstack/react-query";
import styled, { ThemeProvider } from "styled-components";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive"; // 모바일 여부 감지

import Header from "@components/common/Header";
import Navbar from "@components/common/Navbar";
import MobileNavbar from "@components/common/MobileNavbar";
import Background from "@styles/BackGround";
import { GlobalStyle } from "@styles/GlobalStyle";
import { themeState } from "@store/themeState";
import { darkTheme } from "@styles/theme/darkTheme";
import { lightTheme } from "@styles/theme/lightTheme";
import TransitionContent from "@components/common/TransitionContent";
import loginState from "@store/loginState";

import userInfoState, { userInfoType } from "@store/userInfoState";
import { getUserInfo } from "@services/userService";

import { isExpModalState } from "@store/expState";
import ExperienceModal from "@components/common/ExperienceModal";
import GoalManager from "./AppGoalManager";
import LanguageToggleBtn from "@components/common/LanguageToggleBtn";
import TutorialTip from "@components/common/TutorialTip";
// import LevelUpModal from "@components/common/LevelUpModal";

const App: React.FC = () => {
  const theme = useRecoilValue(themeState) === "dark" ? darkTheme : lightTheme;
  const expModalState = useRecoilValue(isExpModalState);
  const isLogin = useRecoilValue(loginState);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    console.log(
      " _   _                       _                               \n\
      | \\ | |                     | |                              \n\
      |  \\| |  ___ __      __ ___ | |      ___   __ _  _ __  _ __  \n\
      | . ` | / _ \\\\ \\ /\\ / // __|| |     / _ \\ / _` || '__|| '_ \\ \n\
      | |\\  ||  __/ \\ V  V / \\__ \\| |____|  __/| (_| || |   | | | |\n\
      \\_| \\_/ \\___|  \\_/\\_/  |___/\\_____/ \\___| \\__,_||_|   |_| |_\n\
      \n\
      Welcome To NewsLearn!"
    );

  }, []);

  // 로그인이 되면 회원 정보를 저장
  const setUserInfo = useSetRecoilState(userInfoState);
  const resetUserInfo = useResetRecoilState(userInfoState);
  const { data: userInfoData } = useQuery<userInfoType>({
    queryKey: ["getUserInfo"],
    queryFn: getUserInfo,
    enabled: isLogin, // isLogin이 true일 때만 쿼리 실행
    staleTime: 15 * 60 * 1000,
  });

  useEffect(() => {
    if (userInfoData) {
      setUserInfo({ ...userInfoData, isInitialized: true });
    } else {
      resetUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfoData]);

  return (
    <ThemeProvider theme={theme}>
      <TutorialTip />
      <GlobalStyle />
      <Background />
      <AppContainer id="app-container">
        {!isMobile && <Header />}
        <TransitionContent>
          <Outlet />
        </TransitionContent>
        {isLogin && (isMobile ? <MobileNavbar /> : <Navbar />)}
        {/* 경험치 모달 */}
        <ExperienceModal
          isOpen={expModalState.isOpen}
          experience={expModalState.experience}
          action={expModalState.action}
        />
        {/* 언어 토글 버튼 */}
        <LanguageToggleBtn />
      </AppContainer>
      {/* 목표 관련 내용 */}
      <GoalManager isLogin={isLogin} />
      {/* <LevelUpModal /> */}
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  position: relative;
  @media screen and (min-width: 1280px) {
    width: 90vw;
    min-height: 100vh;
    height: 100vh;
    padding: 0 calc(5vw - 0.1875rem);
  }
  @media screen and (min-width: 768px) and (max-width: 1279px) {
    width: 95vw;
    min-height: 100vh;
    height: 100vh;
    padding: 0 calc(2.5vw - 0.1875rem);
  }
  @media screen and (max-width: 767px) {
    width: 100vw;
    min-height: 100vh;
    height: 100vh;
  }
`;

export default App;
