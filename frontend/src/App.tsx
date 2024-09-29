import { useQuery } from "@tanstack/react-query";
import styled, { ThemeProvider } from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Outlet } from "react-router-dom";

import Header from "@components/common/Header";
import Navbar from "@components/common/Navbar";
import Background from "@styles/BackGround";
import { GlobalStyle } from "@styles/GlobalStyle";
import { themeState } from "@store/themeState";
import { darkTheme } from "@styles/theme/darkTheme";
import { lightTheme } from "@styles/theme/lightTheme";
import TransitionContent from "@components/common/TransitionContent";
import { useEffect } from "react";
import loginState from "@store/loginState";

import { getToken, messaging } from "./firebase";
import userInfoState, { userInfoType } from "@store/userInfoState";
import { getUserInfo } from "@services/userService";

import goalState, { StudyProgressType } from "@store/goalState";
import { getStudyProgress } from "@services/goalService";

const App: React.FC = () => {
  const theme = useRecoilValue(themeState) === "dark" ? darkTheme : lightTheme;
  const isLogin = useRecoilValue(loginState);
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

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("알림 권한이 허용되었습니다.");
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPIDKEY, // Firebase Console에서 제공하는 VAPID Key
        });
        if (token) {
          console.log("토큰을 얻었습니다:", token);
          // 여기서 서버로 토큰을 전송하여 저장
        }
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("알림 권한 요청 중 오류 발생:", error);
    }
  };

  // 알림 권한 설정
  useEffect(() => {
    requestPermission();
  }, []);

  // 로그인이 되면 회원 정보를 저장
  const setUserInfo = useSetRecoilState(userInfoState);
  const { data: userInfoData } = useQuery<userInfoType>({
    queryKey: ["getUserInfo"],
    queryFn: getUserInfo,
    enabled: isLogin, // isLogin이 true일 때만 쿼리 실행
  });

  useEffect(() => {
    if (userInfoData) {
      setUserInfo({ ...userInfoData, isInitialized: true }); // 데이터가 로드되면 Recoil state 업데이트
    }
  }, [userInfoData, setUserInfo]);

  // 로그인 완료 시 회원 목표 및 현황 저장
  const setUserProgress = useSetRecoilState(goalState);
  const { data: studyProgressData } = useQuery<StudyProgressType>({
    queryKey: ["getStudyProgress"],
    queryFn: getStudyProgress,
    enabled: isLogin, // isLogin이 true일 때만 쿼리 실행
  });

  useEffect(() => {
    if (studyProgressData) {
      setUserProgress({ ...studyProgressData, isInitialized: true }); // 데이터가 로드되면 Recoil state 업데이트
    }
  }, [studyProgressData, setUserProgress]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Background />
      <AppContainer>
        <Header />
        <TransitionContent>
          <Outlet />
        </TransitionContent>
        {!isLogin && <Navbar />}
      </AppContainer>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  position: relative;
  width: 90vw;
  padding: 0 calc(5vw - 0.1875rem);
`;

export default App;
