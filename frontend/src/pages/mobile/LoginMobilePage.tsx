import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import NavarButton from "@assets/images/naverButton.png";
import KakaoButton from "@assets/images/kakaoButton.png";
import FullLogo from "@components/common/FullLogo";
import { kakaoLogin, naverLogin } from "@services/userService";
import { usePageTransition } from "@hooks/usePageTransition";
import locationState from "@store/locationState";
import { getRefreshToken } from "@services/axiosInstance";

const LoginMobilePage = () => {
    const [isLogin, setIsLogin] = useState(sessionStorage.getItem("accessToken"));
    const transitionTo = usePageTransition();
    const setCurrentLocation = useSetRecoilState(locationState);

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

    useEffect(() => {
        setCurrentLocation("login");
    }, [setCurrentLocation]);

    useEffect(() => {
        if (isLogin) {
            transitionTo("/");
        } else {
            requestAccessToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, transitionTo]);

    return (
        <Container>
            <LogoDiv onClick={() => transitionTo("/landing")}>
                <FullLogo width={240} height={40} />
            </LogoDiv>
            <LoginButton src={NavarButton} alt="naver" onClick={naverLogin} />
            <LoginButton src={KakaoButton} alt="kakao" onClick={kakaoLogin} />
        </Container>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem; /* 패딩 조정 */
  border-radius: 0.5rem;
`;

const LogoDiv = styled.div`
  margin: 1rem 0 2rem 0; /* 상하 여백 조정 */
  cursor: pointer;
`;

const LoginButton = styled.img`
  width: 20rem; /* 모바일에 맞춰 너비 조정 */
  height: 45px; /* 높이 조정 */
  margin-bottom: 1rem;
  cursor: pointer;
`;

export default LoginMobilePage;
