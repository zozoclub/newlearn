import { Outlet, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import Header from "@components/Header";
import Navbar from "@components/Navbar";
import { useEffect, useState } from "react";

const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  padding: 0 5vw;
`;

// const Content = styled.div`
//   height: calc(100% - 150px);
// `;

const App: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) setTransitionStage("fadeOut");
  }, [location]);

  return (
    <AppContainer>
      <Header />
      <Content
        className={`${transitionStage}`}
        onAnimationEnd={() => {
          setTransitionStage("fadeIn");
          setDisplayLocation(location);
        }}
      >
        <Outlet />
      </Content>
      <Navbar />
    </AppContainer>
  );
};

export const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
export const fadeOutAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;
export const Content = styled.div`
  height: calc(100% - 150px);
  opacity: 0;
  &.fadeIn {
    animation: ${fadeInAnimation} 500ms;
    animation-fill-mode: forwards;
  }
  &.fadeOut {
    animation: ${fadeOutAnimation} 500ms;
    animation-fill-mode: forwards;
    // animation-fill-mode :애니메이션의 끝난 후의 상태를 설정
    // forward : 애니메이션이 끝난 후 마지막 CSS 그대로 있음
  }
`;

export default App;
