import { tutorialTipState } from "@store/tutorialState";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

const TutorialTip = () => {
  const tutorialTip = useRecoilValue(tutorialTipState);
  const { steps, isActive, onComplete } = tutorialTip;
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [contentStyle, setContentStyle] = useState({});
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updateHighlightStyle = useCallback(() => {
    if (isActive && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const appContainer = document
          .querySelector("#app-container")
          ?.getBoundingClientRect();

        setHighlightStyle({
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        });

        if (appContainer) {
          const { top: appTop, right: appRight } = appContainer;
          setContentStyle({
            top: `${
              rect.top + window.scrollY - 128 < appTop
                ? rect.bottom + window.scrollY
                : rect.top + window.scrollY - 96
            }px`,
            left: `${
              rect.left + 128 > appRight ? rect.left - 128 : rect.left
            }px`,
          });
        }
      }
    }
  }, [currentStep, isActive, steps]);

  const scrollToElement = useCallback(() => {
    if (isActive && steps[currentStep] && steps[currentStep].isNeedToGo) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollPosition = window.scrollY + rect.top - 100;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          updateHighlightStyle();
        }, 500);
      }
    }
  }, [currentStep, isActive, steps, updateHighlightStyle]);

  useEffect(() => {
    updateHighlightStyle();
    scrollToElement();

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(updateHighlightStyle, 100);
    };

    window.addEventListener("resize", updateHighlightStyle);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateHighlightStyle);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateHighlightStyle, scrollToElement]);

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current) {
        overlayRef.current.style.top = `${window.scrollY}px`;
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      onComplete();
      setCurrentStep(0);
    }
  };

  const handleSkipButton = () => {
    onComplete();
    setCurrentStep(0);
  };

  // 뒤로 가기 방지 + 모달 로직
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isActive) {
        // 튜토리얼이 띄워져 있는 상태에서 뒤로가기 방지
        event.preventDefault();
        window.history.pushState(null, "", window.location.href); // 현재 페이지로 다시 푸시
      }
    };

    window.history.pushState(null, "", window.location.href); // 페이지 진입 시 히스토리 상태 추가
    window.addEventListener("popstate", handlePopState); // 뒤로 가기 방지

    return () => {
      window.removeEventListener("popstate", handlePopState); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      <Overlay
        ref={overlayRef}
        style={highlightStyle}
        onClick={handleNext}
      ></Overlay>
      <SkipButton onClick={handleSkipButton}>Skip</SkipButton>
      <Content style={contentStyle} onClick={handleNext}>
        <div>{steps[currentStep].content}</div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <StepButton>
            {currentStep + 1}/{steps.length}
          </StepButton>
        </div>
      </Content>
    </>
  );
};

export default TutorialTip;

const Overlay = styled.div`
  position: absolute;
  z-index: 500;
  outline: 3000px solid rgba(0, 0, 0, 0.7);
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    top: -3000px;
    bottom: -3000px;
    left: -3000px;
    right: -3000px;
    pointer-events: auto;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  z-index: 501;
  color: black;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  pointer-events: auto;
`;

const StepButton = styled.div`
  padding: 0.25rem 0.5rem;
  letter-spacing: 0.1rem;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
`;

const SkipButton = styled.div`
  position: fixed;
  z-index: 502;
  bottom: 5%;
  right: 5%;
  width: 4rem;
  padding: 1rem;
  font-size: 1.25rem;
  text-align: center;
  color: white;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: ${(props) => props.theme.shadows.small};
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryPress};
  }
`;
