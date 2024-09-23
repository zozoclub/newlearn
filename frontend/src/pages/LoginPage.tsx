import styled from "styled-components";
import Logo from "@assets/images/logo-full.png";
import NavarButton from "@assets/images/naverButton.png";
import KakaoButton from "@assets/images/kakaoButton.png";
import { kakaoLogin, naverLogin } from "@services/userService";
import { useEffect } from "react";
import { usePageTransition } from "@hooks/usePageTransition";

const LoginPage = () => {
  const isLogin = sessionStorage.getItem("accessToken");
  const transitionTo = usePageTransition();
  console.log(transitionTo);

  useEffect(() => {
    if (isLogin) {
      transitionTo("/");
    }
  }, [isLogin, transitionTo]);

  return (
    <Container>
      <img src={Logo} alt="LogoImage" width="300" height="65" />
      <img
        src={NavarButton}
        alt="naver"
        width="400"
        height="55"
        onClick={naverLogin}
      />
      <img
        src={KakaoButton}
        alt="kakao"
        width="400"
        height="55"
        onClick={kakaoLogin}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: calc(50% + 150px);
  transform: translate(-50%, 0);
  width: 25.25rem;
  height: 16.5rem;
  padding: 3rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.colors.cardBackground + "AA"};
  :first-child {
    margin: 1rem 0 3rem 0;
  }
  :nth-child(2) {
    margin-bottom: 1rem;
    cursor: pointer;
  }
  :nth-child(3) {
    cursor: pointer;
  }
`;

export default LoginPage;
