import { pageTransitionState } from "@store/pageTransition";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

const TransitionContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTransition, setPageTransition] =
    useRecoilState(pageTransitionState);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== pageTransition.targetLocation) {
      if (pageTransition.isTransitioning) {
        setTransitionStage("fadeOut"); // FadeOut 시작
        setTimeout(() => {
          navigate(pageTransition.targetLocation); // 0.5초 후 페이지 이동
          setTransitionStage("fadeIn");
        }, 500); // 500ms 후 이동
        setPageTransition({ isTransitioning: false, targetLocation: "" }); // 상태 초기화
      }
    } else {
      setPageTransition({ isTransitioning: false, targetLocation: "" }); // 상태 초기화
    }
  }, [pageTransition, navigate, setPageTransition, location.pathname]);

  return <Content className={`${transitionStage}`}>{children}</Content>;
};

const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const fadeOutAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;
const Content = styled.div`
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

export default TransitionContent;
