import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import NavarButton from "@assets/icons/naverLogin.svg";
import KakaoButton from "@assets/icons/kakaoLogin.svg";
import FullLogo from "@components/common/FullLogo";
import { kakaoLogin, naverLogin } from "@services/userService";
import { usePageTransition } from "@hooks/usePageTransition";
import locationState from "@store/locationState";
import { getRefreshToken } from "@services/axiosInstance";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(sessionStorage.getItem("accessToken"));
  const transitionTo = usePageTransition();
  const setCurrentLocation = useSetRecoilState(locationState);

  useEffect(() => {
    setCurrentLocation("login");
    return () => {
      setCurrentLocation("");
    };
  }, [setCurrentLocation]);

  useEffect(() => {
    if (isLogin) {
      transitionTo("/");
    } else {
      const requestAccessToken = async () => {
        try {
          const response = await getRefreshToken();
          if (response) {
            setIsLogin(response);
            console.log("refreshToken 유효, 토큰 재발급");
            transitionTo("/");
          } else {
            console.log("refreshToken 만료, 다시 로그인하세요.");
          }
        } catch {
          console.log("refreshToken 만료, 다시 로그인하세요.");
        }
      };

      requestAccessToken();
    }
  }, [isLogin, transitionTo]);

  return (
    <Container>
      <LogoDiv>
        <FullLogo width={360} height={60} />
      </LogoDiv>
      <LoginButtonDiv>
        <LoginButton src={NavarButton} alt="naver" onClick={naverLogin} />
        <LoginButton src={KakaoButton} alt="kakao" onClick={kakaoLogin} />
      </LoginButtonDiv>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 25rem;
  height: 20rem;
  border-radius: 1rem;
  @media screen and (min-width: 768px) {
    padding: 6rem 3rem;
    width: calc(100% - 6rem);
    ${(props) =>
      props.theme.mode === "dark" &&
      `
        border: 1px solid #ffffff22;
        backdrop-filter: blur(12px);  
    `}
  }
  @media screen and (max-width: 767px) {
    width: calc(100% - 2rem);
    padding: 0 1rem;
  }
`;

const LogoDiv = styled.div`
  margin: 1rem 0 4rem 0;
`;
const LoginButtonDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const LoginButton = styled.img`
  flex: 0 1;
  cursor: pointer;
  margin-bottom: 1rem;
  width: 100%;
`;

export default LoginPage;
