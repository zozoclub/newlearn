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
      <LoginButton src={NavarButton} alt="naver" onClick={naverLogin} />
      <LoginButton src={KakaoButton} alt="kakao" onClick={kakaoLogin} />
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
  width: 20rem;
  height: 20rem;
`;

const LogoDiv = styled.div`
  margin-bottom: 3rem;
  margin: 1rem 0 2rem 0;
`;

const LoginButton = styled.img`
  cursor: pointer;
  margin-bottom: 1rem;
  @media screen and (min-width: 768px) {
    width: 25rem;
  }
  @media screen and (max-width: 767px) {
    width: 21rem;
  }
`;

export default LoginPage;
